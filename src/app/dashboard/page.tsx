import { BudgetProgress } from '../../components/app/Dashboard/BudgetProgress'
import { ExpensesCategory } from '../../components/app/Dashboard/ExpensesCategory'
import { RecentTransactions } from '../../components/app/Dashboard/RecentTransactions'
import { Summary } from '../../components/app/Dashboard/Summary'

function Page() {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-6 lg:grid-cols-2">
      <Summary />
      <RecentTransactions />
      <BudgetProgress />
      <ExpensesCategory />
    </div>
  )
}

export default Page
