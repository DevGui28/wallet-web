import { cn } from '@/lib/utils'

export default function Page() {
  return (
    <div
      className={cn(
        'flex h-screen w-screen items-center justify-center gap-5 text-primary-foreground'
      )}
    >
      <div className="flex flex-col gap-4 space-y-6 rounded-lg bg-background p-6 text-center">
        {/* Fundo Principal */}
        <div className="rounded bg-background p-4 text-foreground">
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
    </div>
  )
}
