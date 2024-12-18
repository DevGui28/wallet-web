import { z } from 'zod'
import { PaymentMethod } from '../types/transactions.interface'

export type FormAddTransaction = z.infer<typeof formAddTransactionSchema>

export const formAddTransactionSchema = z
  .object({
    categoryId: z.string({ message: 'Categoria é obrigatória' }),
    name: z.string({ message: 'Nome é obrigatório' }),
    description: z.string().optional(),
    paymentMethod: z
      .string({
        required_error: 'Metodo de pagamento é obrigatório',
      })
      .min(1, 'Metodo de pagamento é obrigatório'),
    creditCardId: z
      .string({ message: 'Credit card ID is required.' })
      .optional(),
    totalInstallments: z.string().optional(),
    date: z.preprocess(
      (val) => new Date(val as string),
      z.date().or(z.string())
    ),
    totalAmount: z
      .string({
        required_error: 'Valor da transação é obrigatório',
      })
      .min(1, 'Valor da transação é obrigatório'),
  })
  .superRefine((data, ctx) => {
    if (
      data.paymentMethod === PaymentMethod.CREDIT_CARD &&
      !data.creditCardId
    ) {
      ctx.addIssue({
        path: ['creditCardId'],
        code: 'custom',
        message:
          'Cartão de crédito é obrigatório quando o método de pagamento é CARTÃO DE CRÉDITO.',
      })
    }

    if (
      (data.paymentMethod === PaymentMethod.CREDIT_CARD &&
        !data.totalInstallments) ||
      data.totalInstallments === '0'
    ) {
      ctx.addIssue({
        path: ['totalInstallments'],
        code: 'custom',
        message:
          'Total de parcelas é obrigatório quando o método de pagamento é CARTÃO DE CRÉDITO.',
      })
    }
  })
