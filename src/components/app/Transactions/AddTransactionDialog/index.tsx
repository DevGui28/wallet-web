'use client'

import { Plus } from '@phosphor-icons/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { handleGetCategories } from '../../../../api'
import FormInput from '../../../shared/Form/FormInput'
import { Button } from '../../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog'

import { zodResolver } from '@hookform/resolvers/zod'
import { CustomSelect } from '../../../shared/CustomSelect'
import FormSelect from '../../../shared/Form/FormSelect'
import { Form } from '../../../ui/form'
import { TransactionType } from '../interfaces'
import { FormAddTransaction, formAddTransactionSchema } from './schema'

export default function AddTransactionDialog() {
  const [open, setOpen] = useState<boolean>(false)
  const [type, setType] = useState<TransactionType>()

  const { data: categories } = useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      if (!type) return
      const data = await handleGetCategories(type)
      return data.map((category) => ({
        value: category.id,
        label: category.name,
      }))
    },
  })
  const form = useForm<FormAddTransaction>({
    resolver: zodResolver(formAddTransactionSchema),
  })

  const handleClose = () => {
    setOpen(false)
  }

  console.log({ errors: form.formState?.errors })

  const onSubmit = (data: FormAddTransaction) => {
    console.log(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="gap-2 rounded-full px-6">
          <Plus size={16} weight="bold" />
          Adicionar transação
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar transação</DialogTitle>
          <DialogDescription>
            Preencha os campos para adicionar uma transação
          </DialogDescription>
        </DialogHeader>
        <CustomSelect
          label="Tipo de transação"
          placeholder="Selecione o tipo de transação"
          options={[
            { value: TransactionType.EXPENSE, label: 'Despesa' },
            { value: TransactionType.INCOME, label: 'Receita' },
          ]}
          onChange={(value) => setType(value as TransactionType)}
        />
        {type && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormInput
                label="Identificação"
                name="name"
                placeholder="Ifood, Uber, Mercado, etc..."
                form={form}
              />
              <FormInput
                label="Descição"
                name="description"
                placeholder="Pizza, ida para festa, etc..."
                form={form}
                isOptional
              />
              <FormSelect
                form={form}
                name="categoryId"
                data={categories}
                label="Categoria"
              />

              <DialogFooter>
                <Button onClick={handleClose} variant="link">
                  Cancelar
                </Button>
                <Button type="submit">Adicionar</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
