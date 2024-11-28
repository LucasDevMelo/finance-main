"use client";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// api account
import { useCreateAccount, useGetAccounts } from "@/features/accounts/api";
import { Select } from "@/components/select";

export const useSelectAccount = (): [
  () => JSX.Element,
  () => Promise<unknown>
] => {
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    value: account.id,
    label: account.name,
  }));
  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);
  const selectValue = useRef<string>();

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    if (promise) {
      promise.resolve(selectValue.current);
      handleClose();
    }
  };

  const handleCancel = () => {
    if (promise) {
      promise.resolve(undefined);
      handleClose();
    }
  };

  const ConfirmationDialog = () => {
    return (
      <Dialog open={!!promise} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecione um banco</DialogTitle>
            <DialogDescription>
              Por favor, selecione um banco para continuar
            </DialogDescription>
          </DialogHeader>
          <Select
            placeholder="Selecione um banco"
            options={accountOptions}
            onChange={(value) => (selectValue.current = value)}
            onCreate={onCreateAccount}
            disabled={accountQuery.isLoading || accountMutation.isPending}
          />
          <DialogFooter className="pt-2">
            <Button variant="ghost" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [ConfirmationDialog, confirm];
};
