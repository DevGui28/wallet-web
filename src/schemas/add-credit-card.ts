import { z } from 'zod'

export type FormAddCreditCard = z.infer<typeof formAddCreditCardSchema>

export const formAddCreditCardSchema = z.object({
  cardName: z.string({ message: 'Nome é obrigatório' }),
  limit: z.string({ message: 'Limite é obrigatório' }),
  closingDay: z.string({ message: 'Dia de fechamento é obrigatório' }),
  dueDay: z.string({ message: 'Dia de vencimento é obrigatório' }),
})
