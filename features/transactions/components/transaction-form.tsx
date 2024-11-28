import { Trash } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTransactionSchema } from "@/db/schema";
// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/select";
import { DatePicker } from "@/components/date-picker";
import { AmountInput } from "@/components/amount-input";
import {
  convertAmountFromMiliunits,
  convertAmountToMiliunits,
} from "@/lib/utils";

export const formSchema = z.object({
  date: z.coerce.date(),
  amount: z.string(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  payee: z.string(),
});
export const apiSchema = insertTransactionSchema.omit({ id: true });

export type FormValues = z.infer<typeof formSchema>;
export type ApiValues = z.infer<typeof apiSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  categoryOptions?: { label: string; value: string }[];
  onCreateCategory: (name: string) => void;
  accountOptions?: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
};

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  categoryOptions,
  onCreateCategory,
  accountOptions,
  onCreateAccount,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (formValues: FormValues) => {
    const amount = parseFloat(formValues.amount);
    const miliunits = convertAmountToMiliunits(amount);
    onSubmit({
      ...formValues,
      amount: miliunits,
    });
  };

  const handleDelete = () => {
    onDelete?.();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banco</FormLabel>
              <FormControl>
                <Select
                  onChange={field.onChange}
                  onCreate={onCreateAccount}
                  value={field.value}
                  options={accountOptions}
                  placeholder="Selecione um Banco"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <Select
                  onChange={field.onChange}
                  onCreate={onCreateCategory}
                  value={field.value}
                  options={categoryOptions}
                  placeholder="Selecione uma categoria"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beneficiário</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  {...field}
                  placeholder="Adicione o Beneficiário"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantia</FormLabel>
              <FormControl>
                <AmountInput
                  disabled={disabled}
                  {...field}
                  placeholder="0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  disabled={disabled}
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Adicione uma descrição(opcional)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={disabled} className="w-full bg-[#E7D49E]">
          {id ? "Salvar" : "Adicionar transação"}
        </Button>
        {!!id && (
          <Button
            variant="destructive"
            type="button"
            onClick={handleDelete}
            disabled={disabled}
            className="w-full"
          >
            <Trash className="mr-2 size-4" />
            Deletar
          </Button>
        )}
      </form>
    </Form>
  );
};
