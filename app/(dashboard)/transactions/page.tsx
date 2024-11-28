"use client";
// icons
import { Loader2, Plus } from "lucide-react";

// transactions hooks
import { useNewTransaction } from "@/features/transactions/hooks";
// transactions api
import {
  useGetTransactions,
  useBulkDeleteTransactions,
  useBulkCreateTransactions,
} from "@/features/transactions/api";

// components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useState } from "react";
import UploadButton from "./upload-button";
import ImportCard from "./import-card";

import { transactions as transactionsSchema } from "@/db/schema";
// account hook
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { toast } from "sonner";

enum VARIANT {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  error: [],
  meta: {},
};

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANT>(VARIANT.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setVariant(VARIANT.IMPORT);
    setImportResults(results);
  };

  const onCancelUpload = () => {
    setVariant(VARIANT.LIST);
    setImportResults(INITIAL_IMPORT_RESULTS);
  };

  const onSubmitImport = async (
    values: (typeof transactionsSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm() as string;
    if (!accountId) toast.error("Por favor, selecione um banco para continuar");
    const data = values.map((transaction) => ({
      ...transaction,
      accountId,
    }));
    bulkCreateTransaction.mutate(data, {
      onSuccess: () => {
        onCancelUpload();
        toast.success("Transações importadas com sucesso");
      },
      onError: () => toast.error("Ocorreu um erro ao importar as transações"),
    });
  };
  const newTransaction = useNewTransaction();
  const bulkCreateTransaction = useBulkCreateTransactions();
  const deleteTransaction = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];

  const isDisabled = deleteTransaction.isPending || transactionsQuery.isLoading;
  if (transactionsQuery.isLoading)
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  if (variant === VARIANT.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelUpload}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Histórico de transações
          </CardTitle>
          <div className="flex flex-col lg:flex-row items-center gap-x-2 gap-y-2">
            <Button
              size={"sm"}
              onClick={newTransaction.onOpen}
              className="w-full lg:w-auto bg-[#E7D49E] text-white"
            >
              <Plus className="mr-2 size-4" />
              Adicionar
            </Button>
            <UploadButton
              onUpload={onUpload}
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            filterKey="payee"
            disabled={isDisabled}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransaction.mutate({ ids });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
