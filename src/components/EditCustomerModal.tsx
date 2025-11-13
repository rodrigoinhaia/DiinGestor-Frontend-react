import { useState, useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useUpdateCustomer } from '@/hooks/useCustomers';
import { toast } from 'sonner';
import { cnpjService } from '@/services/cnpjService';
import type { Customer } from '@/services/customersService';

const customerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  document: z.string().min(11, 'Documento inválido'),
  isActive: z.boolean().default(true),
  address: z.object({
    street: z.string().min(1, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    zipCode: z.string().min(8, 'CEP inválido'),
  }),
});

type CustomerInput = z.input<typeof customerSchema>;
type CustomerOutput = z.output<typeof customerSchema>;

interface EditCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

export function EditCustomerModal({ open, onOpenChange, customer }: EditCustomerModalProps) {
  const updateCustomerMutation = useUpdateCustomer();
  const [isSearchingCNPJ, setIsSearchingCNPJ] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInput, unknown, CustomerOutput>({
    resolver: zodResolver(customerSchema),
  });

  const cnpjValue = watch('document');
  const isActiveValue = watch('isActive');

  // Preencher formulário quando o cliente mudar
  useEffect(() => {
    if (customer) {
      setValue('name', customer.name);
      setValue('email', customer.email);
      setValue('phone', customer.phone);
      setValue('document', customer.document);
      setValue('isActive', customer.isActive);
      setValue('address.street', customer.address.street);
      setValue('address.number', customer.address.number);
      setValue('address.complement', customer.address.complement || '');
      setValue('address.neighborhood', customer.address.neighborhood);
      setValue('address.city', customer.address.city);
      setValue('address.state', customer.address.state);
      setValue('address.zipCode', customer.address.zipCode);
    }
  }, [customer, setValue]);

  const onSubmit: SubmitHandler<CustomerOutput> = async (data) => {
    if (!customer) return;

    try {
      await updateCustomerMutation.mutateAsync({
        id: customer.id,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          document: data.document,
          isActive: data.isActive,
          address: data.address,
        },
      });
      toast.success('Cliente atualizado com sucesso!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao atualizar cliente. Tente novamente.');
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleBuscarCNPJ = async () => {
    const cnpj = cnpjValue?.replace(/[^\d]/g, '');
    
    if (!cnpj || cnpj.length !== 14) {
      toast.error('Informe um CNPJ válido com 14 dígitos');
      return;
    }

    setIsSearchingCNPJ(true);
    
    try {
      const dados = await cnpjService.buscarPorCNPJ(cnpj);
      
      setValue('name', dados.razao_social || dados.nome_fantasia || '');
      
      if (dados.email) {
        setValue('email', dados.email);
      }
      
      if (dados.telefone) {
        setValue('phone', cnpjService.formatarTelefone(dados.telefone));
      }
      
      if (dados.logradouro) {
        setValue('address.street', dados.logradouro);
      }
      
      if (dados.numero) {
        setValue('address.number', dados.numero);
      }
      
      if (dados.complemento) {
        setValue('address.complement', dados.complemento);
      }
      
      if (dados.bairro) {
        setValue('address.neighborhood', dados.bairro);
      }
      
      if (dados.municipio) {
        setValue('address.city', dados.municipio);
      }
      
      if (dados.uf) {
        setValue('address.state', dados.uf);
      }
      
      if (dados.cep) {
        setValue('address.zipCode', cnpjService.formatarCEP(dados.cep));
      }
      
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao buscar CNPJ');
    } finally {
      setIsSearchingCNPJ(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-4">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Cliente</DialogTitle>
          <DialogDescription className="text-sm">
            Atualize as informações da empresa
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 flex-1">
          {/* Status */}
          <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
            <Switch
              id="isActive"
              checked={isActiveValue}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Cliente {isActiveValue ? 'Ativo' : 'Inativo'}
            </Label>
          </div>

          {/* Informações básicas */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Informações Básicas</h3>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="document">CNPJ *</Label>
                <div className="flex flex-wrap gap-2 items-center">
                  <Input
                    id="document"
                    {...register('document')}
                    placeholder="00.000.000/0000-00"
                    className="h-9 w-[300px] sm:w-[320px]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBuscarCNPJ}
                    disabled={isSearchingCNPJ}
                    className="shrink-0 h-9 w-[110px]"
                  >
                    {isSearchingCNPJ ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    <span className="ml-2">Buscar</span>
                  </Button>
                </div>
                {errors.document && (
                  <p className="text-sm text-red-600">{errors.document.message}</p>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Razão Social *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Nome da empresa"
                  className="h-9"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="contato@empresa.com"
                  className="h-9"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="(11) 99999-9999"
                  className="h-9"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Endereço</h3>
            
            <div className="grid gap-3 md:grid-cols-3">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="street">Rua *</Label>
                <Input
                  id="street"
                  {...register('address.street')}
                  placeholder="Nome da rua"
                  className="h-9"
                />
                {errors.address?.street && (
                  <p className="text-sm text-red-600">{errors.address.street.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  {...register('address.number')}
                  placeholder="123"
                  className="h-9 w-[140px]"
                />
                {errors.address?.number && (
                  <p className="text-sm text-red-600">{errors.address.number.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  {...register('address.complement')}
                  placeholder="Sala 101"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  {...register('address.neighborhood')}
                  placeholder="Nome do bairro"
                  className="h-9"
                />
                {errors.address?.neighborhood && (
                  <p className="text-sm text-red-600">{errors.address.neighborhood.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  {...register('address.city')}
                  placeholder="São Paulo"
                  className="h-9"
                />
                {errors.address?.city && (
                  <p className="text-sm text-red-600">{errors.address.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  {...register('address.state')}
                  placeholder="SP"
                  maxLength={2}
                  className="h-9 w-[80px]"
                />
                {errors.address?.state && (
                  <p className="text-sm text-red-600">{errors.address.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP *</Label>
                <Input
                  id="zipCode"
                  {...register('address.zipCode')}
                  placeholder="00000-000"
                  className="h-9 w-[130px]"
                />
                {errors.address?.zipCode && (
                  <p className="text-sm text-red-600">{errors.address.zipCode.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="h-9">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-9">
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
