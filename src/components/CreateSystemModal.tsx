import type { SubmitHandler } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { useCreateSystem } from '@/hooks/useSystems';

const systemSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional(),
  code: z.string().optional(),
  isActive: z.boolean().default(true),
});

type SystemInput = z.input<typeof systemSchema>;
type SystemOutput = z.output<typeof systemSchema>;

interface CreateSystemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSystemModal({ open, onOpenChange }: CreateSystemModalProps) {
  const createSystem = useCreateSystem();

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<SystemInput, unknown, SystemOutput>({
    resolver: zodResolver(systemSchema),
    defaultValues: { isActive: true } as Partial<SystemInput>,
  });

  const onSubmit: SubmitHandler<SystemOutput> = async (data) => {
    try {
      await createSystem.mutateAsync({
        name: data.name,
        description: data.description,
        code: data.code,
        isActive: data.isActive,
      });
      toast.success('Sistema criado com sucesso!');
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao criar sistema');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Editar Sistema
          </DialogTitle>
          <DialogDescription className="bg-blue-50 p-3 rounded text-blue-700 text-sm">
            <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Edite as informações do sistema abaixo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-3">
            {/* Nome do Sistema */}
            <div className="col-span-12 space-y-1">
              <Label htmlFor="name" className="text-xs font-semibold">Nome do Sistema *</Label>
              <Input
                id="name"
                {...register('name')}
                className="h-8 text-sm"
                placeholder="Ex: ERP, CRM, PDV"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            {/* Código */}
            <div className="col-span-6 space-y-1">
              <Label htmlFor="code" className="text-xs">Código (opcional)</Label>
              <Input
                id="code"
                {...register('code')}
                className="h-8 text-sm"
                placeholder="Ex: ERP001"
              />
              {errors.code && <p className="text-xs text-red-600">{errors.code.message}</p>}
            </div>

            {/* Status */}
            <div className="col-span-6 space-y-1">
              <Label className="text-xs">Status do Sistema</Label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2 h-8">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <span className="text-sm">{field.value ? 'Sistema Ativo' : 'Sistema Inativo'}</span>
                  </div>
                )}
              />
            </div>

            {/* Descrição */}
            <div className="col-span-12 space-y-1">
              <Label htmlFor="description" className="text-xs">Descrição do Sistema</Label>
              <textarea
                id="description"
                {...register('description')}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Ex: Sistema de PDV completo para restaurantes e comércio"
                rows={3}
              />
              {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
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
