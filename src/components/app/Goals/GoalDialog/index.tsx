'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function GoalDialog({ open, setOpen }: Props) {
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [icon, setIcon] = useState('✈️')

  const handleSubmit = () => {
    setOpen(false)
    setTitle('')
    setTargetAmount('')
    setDeadline('')
    setIcon('✈️')
  }

  const icons = [
    { value: '✈️', label: 'Viagem' },
    { value: '🚗', label: 'Carro' },
    { value: '🏠', label: 'Casa' },
    { value: '🛡️', label: 'Emergência' },
    { value: '🎓', label: 'Educação' },
    { value: '💻', label: 'Tecnologia' },
    { value: '👶', label: 'Família' },
    { value: '🏝️', label: 'Aposentadoria' },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Objetivo</DialogTitle>
          <DialogDescription>
            Defina uma meta financeira para acompanhar seu progresso.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Viagem para o Japão"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="targetAmount">Valor Total (R$)</Label>
            <Input
              id="targetAmount"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="0,00"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deadline">Data Limite</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icon">Ícone</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {icons.map((iconOption) => (
                  <SelectItem key={iconOption.value} value={iconOption.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{iconOption.value}</span>
                      {iconOption.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
