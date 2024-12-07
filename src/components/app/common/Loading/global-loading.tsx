import { CircularProgress } from '@mui/material'

export function LoadingGlobal() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-center text-foreground">
      <CircularProgress
        size={40}
        className="mr-2 h-1 w-1 animate-spin text-foreground"
      />
    </div>
  )
}
