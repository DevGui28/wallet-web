import AddTransactionDialog from '../../components/app/Transactions/AddTransactionDialog'
import TransactionsTable from '../../components/app/Transactions/TransactionsTable'

function Page() {
  return (
    <div className="mb-6 w-full">
      <div className="mb-4 flex items-center justify-end">
        <AddTransactionDialog />
      </div>
      <TransactionsTable />
    </div>
  )
}

export default Page
