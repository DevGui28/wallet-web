import { addYears } from 'date-fns'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { toast } from 'sonner'
import { handlePaySplitOrRecurrence } from '../../../../../api'
import FormDatePicker from '../../../../shared/Form/FormDatePicker'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../../ui/alert-dialog'
import { Button } from '../../../../ui/button'
import { Form } from '../../../../ui/form'

type PayDialogProps = {
  id: string
  paid?: boolean
}

export default function PayDialog({ id, paid }: PayDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm()

  const queryClient = useQueryClient()

  const handleSubmit = async ({ paidAt }: { paidAt?: string }) => {
    try {
      await handlePaySplitOrRecurrence(
        id,
        paidAt ? new Date(paidAt) : new Date()
      )
      toast.success('Parcela paga com sucesso')
      queryClient.invalidateQueries('splitsOrRecurrences')
      setIsOpen(false)
    } catch (error) {
      toast.error('Erro ao pagar parcela')
    }
  }

  return (
    <AlertDialog defaultOpen={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button type="button" disabled={paid}>
          {paid ? 'Pago' : 'Pagar'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Selecione a data de pagamento da parcela
          </AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormDatePicker
              form={form}
              name="paidAt"
              label="Data de pagamento"
              placeholder="Selecione a data de pagamento"
              maxDate={addYears(new Date(), 2)}
              minDate={new Date('2021-01-01')}
              modal
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction type="submit">Pagar</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
