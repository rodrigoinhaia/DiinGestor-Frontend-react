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
      <DialogContent className="sm:max-w-[720px] max-h-[88vh] overflow-hidden flex flex-col p-3">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Novo Contrato</DialogTitle>
          <DialogDescription className="text-xs">Vincule um cliente a um plano</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 flex-1">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-6 space-y-1">
              <Label className="text-xs">Cliente *</Label>
              <Select onValueChange={(v) => setValue('customerId', v)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {((customers as Customer[]) || []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && <p className="text-xs text-red-600">{errors.customerId.message}</p>}
            </div>

            <div className="col-span-12 md:col-span-6 space-y-1">
              <Label className="text-xs">Plano *</Label>
              <Select onValueChange={(v) => setValue('planId', v)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {((plans as Plan[]) || []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.planId && <p className="text-xs text-red-600">{errors.planId.message}</p>}
            </div>

            <div className="col-span-12 md:col-span-4 space-y-1">
              <Label htmlFor="startDate" className="text-xs">Início *</Label>
              <Input id="startDate" type="date" {...register('startDate')} className="h-8 text-sm" />
              {errors.startDate && <p className="text-xs text-red-600">{errors.startDate.message}</p>}
            </div>
            <div className="col-span-12 md:col-span-4 space-y-1">
              <Label htmlFor="endDate" className="text-xs">Término *</Label>
              <Input id="endDate" type="date" {...register('endDate')} className="h-8 text-sm" />
              {errors.endDate && <p className="text-xs text-red-600">{errors.endDate.message}</p>}
            </div>
            <div className="col-span-12 md:col-span-4 space-y-1 flex items-end">
              <div className="flex items-center space-x-2 h-8">
                <Input id="autoRenew" type="checkbox" {...register('autoRenew')} className="w-4 h-4" />
                <Label htmlFor="autoRenew" className="text-xs cursor-pointer">Renovação automática</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={handleClose} className="h-8">Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="h-8">{isSubmitting ? 'Salvando...' : 'Criar Contrato'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
