export default function Page() {
  const componente = (
    <div className="m-6 flex flex-col gap-4 space-y-6 rounded-lg bg-card text-center">
      {/* Fundo Principal */}
      <div className="rounded bg-card p-4 text-card-foreground">
        Fundo principal com texto primário.
      </div>

      {/* Cartão */}
      <div className="rounded bg-card p-4 text-card-foreground shadow">
        Este é um cartão.
      </div>

      {/* Popover */}
      <div className="rounded border bg-popover p-4 text-popover-foreground">
        Este é um popover.
      </div>

      {/* Botão Primário */}
      <button className="rounded bg-primary px-4 py-2 text-primary-foreground">
        Botão Primário
      </button>

      {/* Botão Secundário */}
      <button className="rounded bg-secondary px-4 py-2 text-secondary-foreground">
        Botão Secundário
      </button>

      {/* Elemento Muted */}
      <div className="rounded bg-muted p-4 text-muted-foreground">
        Elemento com estilo apagado.
      </div>

      {/* Badge (Acento) */}
      <span className="rounded bg-accent px-2 py-1 text-accent-foreground">
        Destaque
      </span>

      {/* Botão Destrutivo */}
      <button className="rounded bg-destructive px-4 py-2 text-destructive-foreground">
        Deletar
      </button>
    </div>
  )

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-card text-primary-foreground">
      {componente}
      {componente}
      {componente}
    </div>
  )
}
