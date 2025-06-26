'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  PencilSimpleLine,
  Plus,
  Trash,
  CurrencyCircleDollar,
  Calendar,
} from '@phosphor-icons/react'
import {
  RecurringBill,
  CreateRecurringBillDTO,
  UpdateRecurringBillDTO,
} from '../../../../types/recurring-bills.interface'
import {
  useRecurringBills,
  useDeleteRecurringBill,
  useCreateRecurringBill,
  useUpdateRecurringBill,
} from '../../../../hooks/useRecurringBills'
import { toast } from 'sonner'
import { formatCurrency } from '../../../../lib/utils'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import FormInput from '../../../shared/Form/FormInput'

// Schema para validação do formulário
const recurringBillFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  amount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  recurrenceDay: z.coerce
    .number()
    .min(1, 'Dia deve ser entre 1 e 31')
    .max(31, 'Dia deve ser entre 1 e 31'),
})

type RecurringBillFormValues = z.infer<typeof recurringBillFormSchema>

interface RecurringBillFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  bill?: RecurringBill
}

function RecurringBillFormModal({
  open,
  onOpenChange,
  mode,
  bill,
}: RecurringBillFormModalProps) {
  const createRecurringBill = useCreateRecurringBill()
  const updateRecurringBill = useUpdateRecurringBill()

  const form = useForm<RecurringBillFormValues>({
    resolver: zodResolver(recurringBillFormSchema),
    defaultValues: {
      name: bill?.name || '',
      description: bill?.description || '',
      amount: bill?.amount || undefined,
      recurrenceDay: bill?.recurrenceDay || undefined,
    },
  })

  const onSubmit = (data: RecurringBillFormValues) => {
    if (mode === 'create') {
      const newBill: CreateRecurringBillDTO = {
        name: data.name,
        description: data.description || '',
        amount: data.amount,
        recurrenceDay: data.recurrenceDay,
      }

      createRecurringBill.mutate(newBill, {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      })
    } else if (mode === 'edit' && bill) {
      const updatedBill: UpdateRecurringBillDTO = {
        id: bill.id,
        name: bill.name,
        description: bill.description || '',
        amount: data.amount,
        recurrenceDay: data.recurrenceDay,
      }

      updateRecurringBill.mutate(
        { id: bill.id, data: updatedBill },
        {
          onSuccess: () => {
            form.reset()
            onOpenChange(false)
          },
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nova Conta Fixa' : 'Editar Conta Fixa'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Adicione uma nova conta fixa ao sistema.'
              : 'Edite os detalhes da conta fixa selecionada.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="name"
              label="Nome"
              placeholder="Aluguel"
              form={form}
              disabled={mode === 'edit'}
            />

            <FormInput
              name="description"
              label="Descrição"
              placeholder="Descrição"
              form={form}
              isOptional
              disabled={mode === 'edit'}
            />

            <FormInput
              name="amount"
              label="Valor"
              placeholder="0.00"
              form={form}
              prefix="R$ "
              numeric
              withMask
            />

            <FormInput
              name="recurrenceDay"
              label="Dia de Vencimento"
              placeholder="10"
              form={form}
              numeric
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  createRecurringBill.isPending || updateRecurringBill.isPending
                }
              >
                {createRecurringBill.isPending || updateRecurringBill.isPending
                  ? 'Salvando...'
                  : mode === 'create'
                    ? 'Criar'
                    : 'Atualizar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function PayablesTable() {
  const { data: recurringBills, isLoading } = useRecurringBills()
  const deleteRecurringBillMutation = useDeleteRecurringBill()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedBill, setSelectedBill] = useState<RecurringBill | null>(null)

  const handleOpenEditModal = (bill: RecurringBill) => {
    setSelectedBill(bill)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (bill: RecurringBill) => {
    setSelectedBill(bill)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteBill = () => {
    if (!selectedBill) return

    deleteRecurringBillMutation.mutate(selectedBill.id, {
      onSuccess: () => {
        toast.success('Conta fixa removida com sucesso')
        setIsDeleteModalOpen(false)
      },
      onError: () => {
        toast.error('Erro ao remover conta fixa')
      },
    })
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Contas Fixas</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2" size={16} />
          Nova Conta Fixa
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <p>Carregando...</p>
        </div>
      ) : recurringBills?.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p>Nenhuma conta fixa encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {recurringBills?.map((bill) => (
            <Card
              key={bill.id}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="truncate">{bill.name}</span>
                  <Badge
                    variant="outline"
                    className="shrink-0 px-4 py-1 text-xs"
                  >
                    Dia {bill.recurrenceDay}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CurrencyCircleDollar
                      size={16}
                      className="text-muted-foreground"
                    />
                    <span className="font-medium">
                      {formatCurrency(bill.amount)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar
                      size={16}
                      className="mt-0.5 text-muted-foreground"
                    />
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {bill.description}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <PencilSimpleLine
                  size={14}
                  className="cursor-pointer text-muted-foreground hover:text-primary sm:size-4"
                  onClick={() => handleOpenEditModal(bill)}
                  weight="bold"
                />
                <Trash
                  size={14}
                  className="cursor-pointer text-muted-foreground hover:text-destructive sm:size-4"
                  onClick={() => handleOpenDeleteModal(bill)}
                  weight="bold"
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a conta fixa &quot;
              {selectedBill?.name}&quot;? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteBill}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RecurringBillFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        mode="create"
      />

      {selectedBill && (
        <RecurringBillFormModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          mode="edit"
          bill={selectedBill}
        />
      )}
    </>
  )
}
