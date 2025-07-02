import { redirect } from 'next/navigation'
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
} from '../../../ui/alert-dialog'
import { Button } from '../../../ui/button'
import { useDeleteCreditCard } from '../../../../hooks/useCreditCards'

type DeletedCardDialogProps = {
  id: string
}

export default function DeletedCardDialog({ id }: DeletedCardDialogProps) {
  const deleteCreditCardMutation = useDeleteCreditCard()
  const handleDelete = async () => {
    try {
      await deleteCreditCardMutation.mutateAsync(id)
      redirect('/credit-card')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" type="button">
          Excluir cartão
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você tem certeza que deseja excluir este cartão?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="flex flex-col gap-2">
              Caso você opte por apagar este cartão, todas as compras associadas
              a ele serão permanentemente excluídas.
              <span className="font-bold text-destructive">
                Esta ação não pode ser desfeita.
              </span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
