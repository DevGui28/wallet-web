import { Card } from '../../components/ui/card'

function Page() {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
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
