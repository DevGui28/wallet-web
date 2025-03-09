import { BudgetProgress } from '../../components/app/Dashboard/BudgetProgress'
import { RecentTransactions } from '../../components/app/Dashboard/RecentTransactions'
import { Summary } from '../../components/app/Dashboard/Summary'
import { Card } from '../../components/ui/card'

function Page() {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-6 lg:grid-cols-2">
      <Summary />
      <RecentTransactions />
      <BudgetProgress />
      <Card className="flex items-center justify-center p-5">
        <h1>Dashboard</h1>
      </Card>
      <Card className="flex items-center justify-center p-5">
        <h1>Dashboard</h1>
      </Card>
      <Card className="flex items-center justify-center p-5">
        <h1>Dashboard</h1>
      </Card>
    </div>
  )
}

export default Page
