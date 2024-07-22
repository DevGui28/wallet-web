import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import DeleteIcon from '@mui/icons-material/Delete'

type AlertDeleteProps = {
  id: string
}

export function AlertDelete({ id }: AlertDeleteProps) {
  const handleDelete = async () => {
    try {
      // await axiosInstance.delete(`/expense/${id}`)
      console.log(`Deleted ${id}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <DeleteIcon sx={{ color: 'red' }} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza disso?</AlertDialogTitle>
          <AlertDialogDescription>
            Se você deletar, não será possível recuperar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
