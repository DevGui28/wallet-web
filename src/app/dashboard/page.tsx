import { Account } from '../../components/app/Dashboard/Accounts'
import { Summary } from '../../components/app/Dashboard/Summary'
import { Card } from '../../components/ui/card'

function Page() {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-2">
      <Summary />
      <Account />
      <Card className="flex items-center justify-center p-5">
        <h1>Dashboard</h1>
      </Card>
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
