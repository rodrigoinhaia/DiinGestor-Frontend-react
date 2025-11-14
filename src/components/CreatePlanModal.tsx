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
  description: z.string().optional(),
  finalPrice: z.coerce.number().min(0, 'Preço deve ser no mínimo 0'),
  billingCycle: z.enum(['monthly', 'quarterly', 'annual']),
  maxUsers: z.coerce.number().min(1).default(1),
  maxCompanies: z.coerce.number().min(1).default(1),
  maxNFSeIssuers: z.coerce.number().min(1).default(1),
  valuePerCompany: z.coerce.number().min(0).default(0),
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
    defaultValues: { 
      billingCycle: 'monthly',
      maxUsers: 1,
      maxCompanies: 1,
      maxNFSeIssuers: 1,
      valuePerCompany: 0,
    } as Partial<PlanInput>
  })

  const onSubmit: SubmitHandler<PlanOutput> = async (data) => {
    try {
      await createPlan.mutateAsync({
        name: data.name,
        description: data.description || '',
        billingCycle: data.billingCycle,
        finalPrice: data.finalPrice,
        configuration: {
          maxUsers: data.maxUsers,
          maxCompanies: data.maxCompanies,
          maxNFSeIssuers: data.maxNFSeIssuers,
          valuePerCompany: data.valuePerCompany,
          customMenu: false,
        },
        modules: [], // Sem módulos por enquanto - será adicionado no wizard completo
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
            <div className="col-span-12 md:col-span-8 space-y-1">
              <Label htmlFor="name" className="text-xs">Nome *</Label>
              <Input id="name" {...register('name')} className="h-8 text-sm" placeholder="Ex: Plano Básico" />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div className="col-span-12 md:col-span-4 space-y-1">
              <Label className="text-xs">Ciclo *</Label>
              <Select onValueChange={(v) => setValue('billingCycle', v as PlanInput['billingCycle'])} defaultValue="monthly">
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
              <Label htmlFor="description" className="text-xs">Descrição</Label>
              <Input id="description" {...register('description')} className="h-8 text-sm" placeholder="Descrição do plano" />
              {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
            </div>
            <div className="col-span-12 md:col-span-4 space-y-1">
              <Label htmlFor="maxUsers" className="text-xs">Usuários *</Label>
              <Input id="maxUsers" type="number" {...register('maxUsers')} className="h-8 text-sm" />
              {errors.maxUsers && <p className="text-xs text-red-600">{errors.maxUsers.message}</p>}
            </div>
            <div className="col-span-12 md:col-span-4 space-y-1">
              <Label htmlFor="maxCompanies" className="text-xs">Empresas *</Label>
              <Input id="maxCompanies" type="number" {...register('maxCompanies')} className="h-8 text-sm" />
              {errors.maxCompanies && <p className="text-xs text-red-600">{errors.maxCompanies.message}</p>}
            </div>
            <div className="col-span-12 md:col-span-4 space-y-1">
              <Label htmlFor="maxNFSeIssuers" className="text-xs">Emissores NFSe *</Label>
              <Input id="maxNFSeIssuers" type="number" {...register('maxNFSeIssuers')} className="h-8 text-sm" />
              {errors.maxNFSeIssuers && <p className="text-xs text-red-600">{errors.maxNFSeIssuers.message}</p>}
            </div>
            <div className="col-span-12 md:col-span-6 space-y-1">
              <Label htmlFor="valuePerCompany" className="text-xs">Valor por Empresa (R$)</Label>
              <Input id="valuePerCompany" type="number" step="0.01" {...register('valuePerCompany')} className="h-8 text-sm" />
              {errors.valuePerCompany && <p className="text-xs text-red-600">{errors.valuePerCompany.message}</p>}
            </div>
            <div className="col-span-12 md:col-span-6 space-y-1">
              <Label htmlFor="finalPrice" className="text-xs">Preço Final (R$) *</Label>
              <Input id="finalPrice" type="number" step="0.01" {...register('finalPrice')} className="h-8 text-sm" />
              {errors.finalPrice && <p className="text-xs text-red-600">{errors.finalPrice.message}</p>}
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
