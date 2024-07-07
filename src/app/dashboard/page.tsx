import axiosInstance from "@/api/axiosInstance";

export default async function Dashboard() {
  const installments = await axiosInstance.get("/installments");
  console.log(installments.data);
  
  return (
    <div>
      <h1>Dashboard</h1>
      {installments.data.map((installment: any) => (
        <div key={installment.id} className="flex flex-col mb-5">
          <p>{installment.expense.description}</p>
          <p>{installment.amount}</p>
          <p>{installment.dueDate}</p>
          <p>{installment.paid ? 'Pago' : 'A pagar'}</p>
          <p>{`Parcela: ${installment.currentInstallment}/${installment.expense.recurring}`}</p>
        </div>
        ))}
    </div>
  );
}
