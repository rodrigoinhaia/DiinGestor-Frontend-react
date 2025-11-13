import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useCreateInvoice } from '../hooks/useInvoices'
import { useContracts } from '../hooks/useContracts'
import type { Contract } from '../services/contractsService'

const invoiceSchema = z.object({
  contractId: z.string().min(1, 'Selecione um contrato'),
  dueDate: z.string().min(1, 'Informe o vencimento'),
  amount: z.coerce.number().positive('Informe um valor válido'),
  description: z.string().optional(),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

interface CreateInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateInvoiceModal({ open, onOpenChange }: CreateInvoiceModalProps) {
  const createInvoice = useCreateInvoice()
  const { data: contracts } = useContracts()

  const resolver = zodResolver(invoiceSchema) as unknown as Resolver<InvoiceFormData>
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<InvoiceFormData>({
    resolver,
  })

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      await createInvoice.mutateAsync({
        contractId: data.contractId,
        dueDate: data.dueDate,
        amount: data.amount,
        description: data.description || '',
      })
      toast.success('Fatura criada com sucesso!')
      reset()
      onOpenChange(false)
    } catch (e) {
      toast.error('Erro ao criar fatura')
      console.error(e)
    }
  }

  const handleClose = () => { reset(); onOpenChange(false) }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Fatura</DialogTitle>
          <DialogDescription>Cadastre uma nova fatura</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Contrato *</Label>
            <Select onValueChange={(v) => setValue('contractId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um contrato" />
              </SelectTrigger>
              <SelectContent>
                {((contracts as Contract[]) || []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.contractNumber}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.contractId && <p className="text-sm text-red-600">{errors.contractId.message}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Vencimento *</Label>
              <Input id="dueDate" type="date" {...register('dueDate')} />
              {errors.dueDate && <p className="text-sm text-red-600">{errors.dueDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor *</Label>
              <Input id="amount" type="number" step="0.01" {...register('amount')} />
              {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" placeholder="Ex: Mensalidade Dez/2025" {...register('description')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Criar Fatura'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
