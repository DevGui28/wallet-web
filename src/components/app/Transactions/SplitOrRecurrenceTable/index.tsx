// 'use client'

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { useQuery } from 'react-query'
// import { handleFindTransaction } from '../../../../api'
// import { transactionStatusMapper } from '../../../../lib/mappers'
// import { formatCurrency, formatDateToString } from '../../../../lib/utils'
// import {
//   RecurrenceType,
//   TransactionStatus,
// } from '../../../../types/transactions.interface'
// import PayDialog from './PayDialog'

// type SplitOrRecurrenceTableProps = {
//   id: string
// }

// export default function SplitOrRecurrenceTable({
//   id,
// }: SplitOrRecurrenceTableProps) {
//   const { data: splitsOrRecurrences } = useQuery({
//     queryKey: ['splitsOrRecurrences', id],
//     queryFn: async () => {
//       const transaction = await handleFindTransaction(id)
//       return transaction
//     },
//   })

//   return (
//     <Table>
//       <TableHeader className="sticky top-0 z-10 cursor-default">
//         <TableRow className="text-xs font-bold text-card-foreground">
//           <TableHead>Parcela</TableHead>
//           <TableHead>Valor</TableHead>
//           <TableHead>Vencimento</TableHead>
//           <TableHead>Status</TableHead>
//           <TableHead>Pago em</TableHead>
//           {splitsOrRecurrences?.[0].type === RecurrenceType.RECURRING && (
//             <TableHead>Pagar</TableHead>
//           )}
//         </TableRow>
//       </TableHeader>
//       <TableBody className="overflow-auto">
//         {splitsOrRecurrences?.map((splitOrRecurrence) => (
//           <TableRow key={splitOrRecurrence.id}>
//             <TableCell>{splitOrRecurrence.installmentNumber}</TableCell>
//             <TableCell>{formatCurrency(splitOrRecurrence.amount)}</TableCell>
//             <TableCell>
//               {formatDateToString(splitOrRecurrence.dueDate)}
//             </TableCell>
//             <TableCell>
//               {transactionStatusMapper[splitOrRecurrence.paymentStatus]}
//             </TableCell>
//             <TableCell>
//               {splitOrRecurrence.paidAt
//                 ? formatDateToString(splitOrRecurrence.paidAt)
//                 : 'Pendente'}
//             </TableCell>
//             {splitOrRecurrence.type === RecurrenceType.RECURRING && (
//               <TableCell>
//                 <PayDialog
//                   id={splitOrRecurrence.id}
//                   paid={
//                     splitOrRecurrence.paymentStatus === TransactionStatus.PAID
//                   }
//                 />
//               </TableCell>
//             )}
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   )
// }
