import { redirect } from 'next/navigation'
import { useQueryClient } from 'react-query'
import { toast } from 'sonner'
import { handleDeleteCreditCard } from '../../../../api'
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

type DeletedCardDialogProps = {
  id: string
}

export default function DeletedCardDialog({ id }: DeletedCardDialogProps) {
  const queryClient = useQueryClient()
  const handleDelete = async () => {
    try {
      await handleDeleteCreditCard(id)
      toast.success('Cartão excluído com sucesso')
      queryClient.invalidateQueries('credit-cards')
      redirect('/credit-card')
    } catch (error) {
      toast.error('Erro ao excluir cartão')
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
