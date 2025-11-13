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
import { useCreatePlan } from '../hooks/usePlans'

const planSchema = z.object({
  name: z.string().min(2, 'Informe o nome do plano'),
  description: z.string().min(2, 'Informe a descrição'),
  price: z.coerce.number().positive('Preço deve ser positivo'),
  billingCycle: z.enum(['monthly', 'quarterly', 'annual']),
  features: z.string().optional(), // lista separada por vírgula
})
type PlanInput = z.input<typeof planSchema>
type PlanOutput = z.output<typeof planSchema>

interface CreatePlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePlanModal({ open, onOpenChange }: CreatePlanModalProps) {
  const createPlan = useCreatePlan()

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<PlanInput, unknown, PlanOutput>({
    resolver: zodResolver(planSchema),
    defaultValues: { billingCycle: 'monthly' } as Partial<PlanInput>
  })

  const onSubmit: SubmitHandler<PlanOutput> = async (data) => {
    try {
      await createPlan.mutateAsync({
        name: data.name,
        description: data.description,
        price: data.price,
        billingCycle: data.billingCycle,
        features: (data.features || '')
          .split(',')
          .map(f => f.trim())
          .filter(Boolean)
          .map(name => ({ name, included: true })),
      })
      toast.success('Plano criado com sucesso!')
      reset()
      onOpenChange(false)
    } catch (e) {
      toast.error('Erro ao criar plano')
      console.error(e)
    }
  }

  const handleClose = () => { reset(); onOpenChange(false) }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[720px] max-h-[88vh] overflow-hidden flex flex-col p-3">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Novo Plano</DialogTitle>
          <DialogDescription className="text-xs">Cadastre um novo plano de software</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 flex-1">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-6 space-y-1">
              <Label htmlFor="name" className="text-xs">Nome *</Label>
              <Input id="name" {...register('name')} className="h-8 text-sm" />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div className="col-span-12 md:col-span-3 space-y-1">
              <Label htmlFor="price" className="text-xs">Preço (R$) *</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} className="h-8 text-sm" />
              {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
            </div>
            <div className="col-span-12 md:col-span-3 space-y-1">
              <Label className="text-xs">Ciclo *</Label>
              <Select onValueChange={(v) => setValue('billingCycle', v as PlanInput['billingCycle'])}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="annual">Anual</SelectItem>
                </SelectContent>
              </Select>
              {errors.billingCycle && <p className="text-xs text-red-600">{errors.billingCycle.message}</p>}
            </div>
            <div className="col-span-12 space-y-1">
              <Label htmlFor="description" className="text-xs">Descrição *</Label>
              <Input id="description" {...register('description')} className="h-8 text-sm" />
              {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
            </div>
            <div className="col-span-12 space-y-1">
              <Label htmlFor="features" className="text-xs">Funcionalidades (separadas por vírgula)</Label>
              <Input id="features" placeholder="Relatórios, API, Suporte 24/7" {...register('features')} className="h-8 text-sm" />
            </div>
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={handleClose} className="h-8">Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="h-8">{isSubmitting ? 'Salvando...' : 'Criar Plano'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
