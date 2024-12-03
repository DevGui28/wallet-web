export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-800">
        Ops! Você se perdeu?
      </h1>
      <p className="mb-6 text-lg text-gray-700">
        Parece que a página que você está procurando não existe ou não foi
        implementada ainda.
      </p>
      <p className="mb-6 text-lg text-gray-600">
        Vamos te ajudar a voltar para o caminho certo.
      </p>
      <a
        href="/dashboard"
        className="rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
      >
        Voltar para a página inicial
      </a>
    </div>
  )
}
