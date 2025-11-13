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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Plano</DialogTitle>
          <DialogDescription>Cadastre um novo plano</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} />
              {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input id="description" {...register('description')} />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Ciclo de Cobrança *</Label>
            <Select onValueChange={(v) => setValue('billingCycle', v as PlanInput['billingCycle'])}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="annual">Anual</SelectItem>
              </SelectContent>
            </Select>
            {errors.billingCycle && <p className="text-sm text-red-600">{errors.billingCycle.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Funcionalidades (separadas por vírgula)</Label>
            <Input id="features" placeholder="Relatórios, API, Suporte 24/7" {...register('features')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Criar Plano'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
