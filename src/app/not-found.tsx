export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <h1 className="mb-4 text-4xl font-bold text-card-foreground">
        Ops! Você se perdeu?
      </h1>
      <p className="mb-6 text-lg text-foreground">
        Parece que a página que você está procurando não existe ou não foi
        implementada ainda.
      </p>
      <p className="mb-6 text-lg text-card-foreground">
        Vamos te ajudar a voltar para o caminho certo.
      </p>
      <a
        href="/dashboard"
        className="rounded bg-accent px-4 py-2 font-semibold text-accent-foreground hover:bg-accent/90"
      >
        Voltar para a página inicial
      </a>
    </div>
  )
}
