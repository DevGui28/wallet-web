export default function Loading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-200">
      <div className="flex gap-2">
        <div className="h-4 w-4 animate-bounce rounded-full bg-green-500" />
        <div className="h-4 w-4 animate-bounce rounded-full bg-green-500" />
        <div className="h-4 w-4 animate-bounce rounded-full bg-green-500" />
      </div>
      <p className="text-lg font-semibold">Carregando</p>
    </div>
  )
}
