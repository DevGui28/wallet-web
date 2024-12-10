import { z } from 'zod'
import { PaymentMethod } from '../../interfaces'

export type FormAddTransaction = z.infer<typeof formAddTransactionSchema>

export const formAddTransactionSchema = z
  .object({
    categoryId: z.string({ message: 'Categoria é obrigatória' }),
    name: z.string({ message: 'Nome é obrigatório' }),
    description: z.string().optional(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    creditCardId: z
      .string({ message: 'Credit card ID is required.' })
      .optional(),
    totalInstallments: z
      .number()
      .min(1, 'Total de parcelas deve ser maior que 0.')
      .optional(),
    isSplitOrRecurring: z.boolean().optional(),
    date: z.preprocess(
      (val) => new Date(val as string),
      z.date().or(z.string())
    ),
    totalAmount: z.number(),
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
      data.paymentMethod === PaymentMethod.CREDIT_CARD &&
      !data.totalInstallments
    ) {
      ctx.addIssue({
        path: ['totalInstallments'],
        code: 'custom',
        message:
          'Total de parcelas é obrigatório quando o método de pagamento é CARTÃO DE CRÉDITO.',
      })
    }
  })
