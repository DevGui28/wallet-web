import * as React from "react";
import Table from "@mui/material/Table";
import {
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material/";
import Paper from "@mui/material/Paper";
import formatDate from "@/utils/formatDate";

export default function BasicTable({ installments }: { installments: any }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Descrição</TableCell>
            <TableCell align="center">Valor</TableCell>
            <TableCell align="center">Vencimento</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Parcela</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {installments.map((installment: any) => (
            <TableRow
              key={installment.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {installment.expense.description}
              </TableCell>
              <TableCell align="center">{installment.amount}</TableCell>
              <TableCell align="center">{formatDate(installment.dueDate)}</TableCell>
              <TableCell align="center">{installment.paid ? 'Pago' : 'A pagar'}</TableCell>
              <TableCell align="center">{`${installment.currentInstallment}/${installment.expense.recurring}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
