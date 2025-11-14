import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { useCreateModule } from '@/hooks/useModules';
import type { System } from '@/types/api';

const moduleSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional(),
  code: z.string().optional(),
  systemId: z.string().min(1, 'Selecione um sistema'),
  costPrice: z.coerce.number().min(0, 'Preço de repasse deve ser no mínimo 0'),
  salePrice: z.coerce.number().min(0, 'Preço de venda deve ser no mínimo 0'),
  isActive: z.boolean().default(true),
});

type ModuleInput = z.input<typeof moduleSchema>;
type ModuleOutput = z.output<typeof moduleSchema>;

interface CreateModuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  systems: System[];
}

export function CreateModuleModal({ open, onOpenChange, systems }: CreateModuleModalProps) {
  const createModule = useCreateModule();

  const form = useForm<ModuleInput, unknown, ModuleOutput>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      isActive: true,
      costPrice: 0,
      salePrice: 0,
    } as Partial<ModuleInput>,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = form;
  const isActive = form.watch('isActive');
  const selectedSystemId = form.watch('systemId');

  const onSubmit: SubmitHandler<ModuleOutput> = async (data) => {
    try {
      if (data.salePrice < data.costPrice) {
        toast.error('Preço de venda não pode ser menor que o preço de repasse');
        return;
      }

      await createModule.mutateAsync({
        name: data.name,
        description: data.description,
        code: data.code,
        systemId: data.systemId,
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        isActive: data.isActive,
      });
      toast.success('Módulo criado com sucesso!');
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao criar módulo');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Editar Módulo
          </DialogTitle>
          <DialogDescription className="bg-blue-50 p-3 rounded text-blue-700 text-sm">
            <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Edite as informações do módulo abaixo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-3">
            {/* Nome do Módulo */}
            <div className="col-span-7 space-y-1">
              <Label htmlFor="name" className="text-xs font-semibold">Nome do Módulo *</Label>
              <Input
                id="name"
                {...register('name')}
                className="h-8 text-sm"
                placeholder="Ex: Gestão de Comandas"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            {/* Código */}
            <div className="col-span-5 space-y-1">
              <Label htmlFor="code" className="text-xs">Código (opcional)</Label>
              <Input
                id="code"
                {...register('code')}
                className="h-8 text-sm"
                placeholder="Ex: MOD001"
              />
              {errors.code && <p className="text-xs text-red-600">{errors.code.message}</p>}
            </div>

            {/* Sistema */}
            <div className="col-span-12 space-y-1">
              <Label htmlFor="systemId" className="text-xs font-semibold">Sistema *</Label>
              <Select
                value={selectedSystemId}
                onValueChange={(value) => setValue('systemId', value)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione o sistema" />
                </SelectTrigger>
                <SelectContent>
                  {systems.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      Nenhum sistema cadastrado
                    </div>
                  ) : (
                    systems.filter(s => s.isActive).map((system) => (
                      <SelectItem key={system.id} value={system.id}>
                        {system.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.systemId && <p className="text-xs text-red-600">{errors.systemId.message}</p>}
            </div>

            {/* Descrição */}
            <div className="col-span-12 space-y-1">
              <Label htmlFor="description" className="text-xs">Descrição do Módulo</Label>
              <textarea
                id="description"
                {...register('description')}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Ex: Módulo para gestão de comandas e pedidos"
                rows={3}
              />
              {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
            </div>

            {/* Configurações de Preço */}
            <div className="col-span-12">
              <div className="flex items-center gap-2 mb-3">
                <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold">Configurações de Preço</span>
              </div>
            </div>

            {/* Preço de Repasse */}
            <div className="col-span-6 space-y-1">
              <Label htmlFor="costPrice" className="text-xs font-semibold text-red-600">
                Preço de Repasse *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-red-600">R$</span>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  {...register('costPrice')}
                  className="h-8 text-sm pl-10"
                  placeholder="0,00"
                />
              </div>
              {errors.costPrice && <p className="text-xs text-red-600">{errors.costPrice.message}</p>}
            </div>

            {/* Preço de Venda */}
            <div className="col-span-6 space-y-1">
              <Label htmlFor="salePrice" className="text-xs font-semibold text-green-600">
                Preço de Venda *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-green-600">R$</span>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  {...register('salePrice')}
                  className="h-8 text-sm pl-10"
                  placeholder="0,00"
                />
              </div>
              {errors.salePrice && <p className="text-xs text-red-600">{errors.salePrice.message}</p>}
            </div>

            {/* Status */}
            <div className="col-span-12 space-y-1">
              <Label className="text-xs">Status do Módulo</Label>
              <div className="flex items-center gap-2 h-8">
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => setValue('isActive', checked)}
                />
                <span className="text-sm">{isActive ? 'Módulo Ativo' : 'Módulo Inativo'}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              className="flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isSubmitting ? 'Salvando...' : 'Atualizar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
