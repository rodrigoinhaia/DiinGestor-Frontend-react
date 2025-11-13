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
      <DialogContent className="sm:max-w-[620px] max-h-[88vh] overflow-hidden flex flex-col p-3">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Nova Fatura</DialogTitle>
          <DialogDescription className="text-xs">Gere uma fatura para um contrato</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 flex-1">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 space-y-1">
              <Label className="text-xs">Contrato *</Label>
              <Select onValueChange={(v) => setValue('contractId', v)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione um contrato" />
                </SelectTrigger>
                <SelectContent>
                  {((contracts as Contract[]) || []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.contractNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.contractId && <p className="text-xs text-red-600">{errors.contractId.message}</p>}
            </div>

            <div className="col-span-12 md:col-span-6 space-y-1">
              <Label htmlFor="dueDate" className="text-xs">Vencimento *</Label>
              <Input id="dueDate" type="date" {...register('dueDate')} className="h-8 text-sm" />
              {errors.dueDate && <p className="text-xs text-red-600">{errors.dueDate.message}</p>}
            </div>
            <div className="col-span-12 md:col-span-6 space-y-1">
              <Label htmlFor="amount" className="text-xs">Valor (R$) *</Label>
              <Input id="amount" type="number" step="0.01" {...register('amount')} className="h-8 text-sm" />
              {errors.amount && <p className="text-xs text-red-600">{errors.amount.message}</p>}
            </div>

            <div className="col-span-12 space-y-1">
              <Label htmlFor="description" className="text-xs">Descrição</Label>
              <Input id="description" placeholder="Ex: Mensalidade Dez/2025" {...register('description')} className="h-8 text-sm" />
            </div>
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={handleClose} className="h-8">Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="h-8">{isSubmitting ? 'Salvando...' : 'Criar Fatura'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
