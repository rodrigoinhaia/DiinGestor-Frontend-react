import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { useCreateContract } from '../hooks/useContracts'
import { useCustomers } from '../hooks/useCustomers'
import { usePlans } from '../hooks/usePlans'
import type { Customer } from '../services/customersService'
import type { Plan } from '../services/plansService'

const contractSchema = z.object({
  customerId: z.string().min(1, 'Selecione um cliente'),
  planId: z.string().min(1, 'Selecione um plano'),
  startDate: z.string().min(1, 'Informe a data inicial'),
  endDate: z.string().min(1, 'Informe a data final'),
  autoRenew: z.boolean().default(true)
})
type ContractInput = z.input<typeof contractSchema>
type ContractOutput = z.output<typeof contractSchema>

interface CreateContractModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateContractModal({ open, onOpenChange }: CreateContractModalProps) {
  const createContract = useCreateContract()
  const { data: customers } = useCustomers()
  const { data: plans } = usePlans()

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ContractInput, unknown, ContractOutput>({
    resolver: zodResolver(contractSchema),
    defaultValues: { autoRenew: true } as Partial<ContractInput>
  })

  const onSubmit: SubmitHandler<ContractOutput> = async (data) => {
    try {
      await createContract.mutateAsync({
        customerId: data.customerId,
        planId: data.planId,
        startDate: data.startDate,
        endDate: data.endDate,
        autoRenew: data.autoRenew,
      })
      toast.success('Contrato criado com sucesso!')
      reset()
      onOpenChange(false)
    } catch (e) {
      toast.error('Erro ao criar contrato')
      console.error(e)
    }
  }

  const handleClose = () => { reset(); onOpenChange(false) }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Contrato</DialogTitle>
          <DialogDescription>Cadastre um novo contrato</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <Select onValueChange={(v) => setValue('customerId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {((customers as Customer[]) || []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customerId && <p className="text-sm text-red-600">{errors.customerId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Plano *</Label>
            <Select onValueChange={(v) => setValue('planId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {((plans as Plan[]) || []).map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.planId && <p className="text-sm text-red-600">{errors.planId.message}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Início *</Label>
              <Input id="startDate" type="date" {...register('startDate')} />
              {errors.startDate && <p className="text-sm text-red-600">{errors.startDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Término *</Label>
              <Input id="endDate" type="date" {...register('endDate')} />
              {errors.endDate && <p className="text-sm text-red-600">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="autoRenew">Renovação automática</Label>
            <Input id="autoRenew" type="checkbox" {...register('autoRenew')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Criar Contrato'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
