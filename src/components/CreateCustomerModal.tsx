// React import not needed with the automatic JSX runtime
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useCreateCustomer, useCustomers } from '@/hooks/useCustomers';
import type { Customer } from '@/services/customersService';
import { toast } from 'sonner';
import { cnpjService } from '@/services/cnpjService';

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

type CustomerFormData = z.infer<typeof customerSchema>;

interface CreateCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowCustomer?: (customer: Customer) => void; // callback para abrir modal de visualização
}

export function CreateCustomerModal({ open, onOpenChange, onShowCustomer }: CreateCustomerModalProps) {
  const createCustomerMutation = useCreateCustomer();
  const [isSearchingCNPJ, setIsSearchingCNPJ] = useState(false);
  const { data: existingCustomers } = useCustomers();
  const [duplicateCustomer, setDuplicateCustomer] = useState<Customer | null>(null);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [duplicateTenant, setDuplicateTenant] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { isActive: true }
  });

  const cnpjValue = watch('document');

  const onSubmit = async (data: CustomerFormData) => {
    // Verificação prévia para evitar chamada desnecessária se já existir CNPJ
    const normalizedDoc = data.document.replace(/[^\d]/g, '');
    const list = Array.isArray(existingCustomers)
      ? existingCustomers
      : Array.isArray((existingCustomers as any)?.customers)
        ? (existingCustomers as any).customers
        : [];
    const found = list.find((c: any) => c.document && c.document.replace(/[^\d]/g, '') === normalizedDoc);
    if (found) {
      setDuplicateCustomer(found as Customer);
      setIsDuplicateDialogOpen(true);
      return;
    }

    try {
      await createCustomerMutation.mutateAsync({ ...data, isActive: data.isActive });
      toast.success('Cliente criado com sucesso!');
      reset();
      onOpenChange(false);
    } catch (error: any) {
      const msg = error instanceof Error ? error.message : 'Erro ao criar cliente';
      // Se mensagem indica duplicidade, abrir dialog
      if (error.isDuplicate || /cadastrado/i.test(msg) || /exist/i.test(msg) || /tenant/i.test(msg)) {
        const normalizedDocErr = data.document.replace(/[^\d]/g, '');
        const foundErr = list.find((c: any) => c.document && c.document.replace(/[^\d]/g, '') === normalizedDocErr);
        setDuplicateCustomer(foundErr as Customer || null);
        setDuplicateTenant(error.tenant || null);
        setIsDuplicateDialogOpen(true);
        return;
      }
      toast.error(msg);
      console.error('Erro ao criar cliente:', error);
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
      
      // Preencher campos automaticamente
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
      
      toast.success('Dados preenchidos com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao buscar CNPJ');
    } finally {
      setIsSearchingCNPJ(false);
    }
  };

  return (
    <>
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[980px] max-h-[88vh] overflow-hidden flex flex-col p-3">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Novo Cliente</DialogTitle>
          <DialogDescription className="text-xs">
            Cadastre uma nova empresa cliente (B2B)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 flex-1">
          {/* Informações básicas */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Informações Básicas</h3>
            
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12 space-y-1">
                <Label htmlFor="document" className="text-xs">CNPJ *</Label>
                <div className="flex flex-wrap gap-2 items-center">
                  <Input
                    id="document"
                    {...register('document')}
                    placeholder="00.000.000/0000-00"
                    className="h-8 text-sm w-[300px] sm:w-[320px]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBuscarCNPJ}
                    disabled={isSearchingCNPJ}
                    className="shrink-0 h-8 w-[110px]"
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
                  <p className="text-xs text-red-600">{errors.document.message}</p>
                )}
              </div>

              {/* Linha compacta: Razão Social, Email e Telefone */}
              <div className="col-span-12 md:col-span-6 space-y-1">
                <Label htmlFor="name" className="text-xs">Razão Social *</Label>
                <Input id="name" {...register('name')} placeholder="Nome da empresa" className="h-8 text-sm" />
                {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div className="col-span-12 md:col-span-3 space-y-1">
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <Input id="email" type="email" {...register('email')} placeholder="email@empresa.com" className="h-8 text-sm" />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div className="col-span-12 md:col-span-3 space-y-1">
                <Label htmlFor="phone" className="text-xs">Telefone *</Label>
                <Input id="phone" {...register('phone')} placeholder="(11) 99999-9999" className="h-8 text-sm" />
                {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Endereço</h3>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12 md:col-span-8 space-y-1">
                <Label htmlFor="street" className="text-xs">Rua *</Label>
                <Input id="street" {...register('address.street')} placeholder="Nome da rua" className="h-8 text-sm" />
                {errors.address?.street && <p className="text-xs text-red-600">{errors.address.street.message}</p>}
              </div>
              <div className="col-span-12 md:col-span-4 space-y-1">
                <Label htmlFor="number" className="text-xs">Número *</Label>
                <Input id="number" {...register('address.number')} placeholder="123" className="h-8 text-sm max-w-[160px]" />
                {errors.address?.number && <p className="text-xs text-red-600">{errors.address.number.message}</p>}
              </div>
              <div className="col-span-12 md:col-span-6 space-y-1">
                <Label htmlFor="complement" className="text-xs">Complemento</Label>
                <Input id="complement" {...register('address.complement')} placeholder="Sala 101" className="h-8 text-sm" />
              </div>
              <div className="col-span-12 md:col-span-6 space-y-1">
                <Label htmlFor="neighborhood" className="text-xs">Bairro *</Label>
                <Input id="neighborhood" {...register('address.neighborhood')} placeholder="Nome do bairro" className="h-8 text-sm" />
                {errors.address?.neighborhood && <p className="text-xs text-red-600">{errors.address.neighborhood.message}</p>}
              </div>
              <div className="col-span-12 md:col-span-5 space-y-1">
                <Label htmlFor="city" className="text-xs">Cidade *</Label>
                <Input id="city" {...register('address.city')} placeholder="São Paulo" className="h-8 text-sm" />
                {errors.address?.city && <p className="text-xs text-red-600">{errors.address.city.message}</p>}
              </div>
              <div className="col-span-6 md:col-span-2 space-y-1">
                <Label htmlFor="state" className="text-xs">Estado *</Label>
                <Input id="state" {...register('address.state')} placeholder="SP" maxLength={2} className="h-8 text-sm max-w-[80px]" />
                {errors.address?.state && <p className="text-xs text-red-600">{errors.address.state.message}</p>}
              </div>
              <div className="col-span-6 md:col-span-5 space-y-1">
                <Label htmlFor="zipCode" className="text-xs">CEP *</Label>
                <Input id="zipCode" {...register('address.zipCode')} placeholder="00000-000" className="h-8 text-sm max-w-[140px]" />
                {errors.address?.zipCode && <p className="text-xs text-red-600">{errors.address.zipCode.message}</p>}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={handleClose} className="h-8">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-8">
              {isSubmitting ? 'Criando...' : 'Criar Cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    {/* Dialog de duplicidade */}
    <Dialog open={isDuplicateDialogOpen} onOpenChange={(o) => !o && setIsDuplicateDialogOpen(false)}>
      <DialogContent className="sm:max-w-[520px] p-4">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            CNPJ já cadastrado
          </DialogTitle>
          <DialogDescription className="text-xs">
            {duplicateTenant 
              ? `Este CNPJ já é cliente do Parceiro: ${duplicateTenant}`
              : 'Já existe um cliente com este CNPJ na base.'}
          </DialogDescription>
        </DialogHeader>
        {duplicateCustomer ? (
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Razão Social:</span> {duplicateCustomer.name}</p>
            <p><span className="font-medium">Email:</span> {duplicateCustomer.email}</p>
            <p><span className="font-medium">Telefone:</span> {duplicateCustomer.phone}</p>
            <p className="font-mono text-xs bg-muted px-2 py-1 rounded">{duplicateCustomer.document}</p>
          </div>
        ) : duplicateTenant ? (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <p className="text-yellow-800">
              Este cliente pertence a outro parceiro (<strong>{duplicateTenant}</strong>) e não pode ser cadastrado novamente.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-muted rounded text-sm text-muted-foreground">
            Cliente já existe no sistema.
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => { setIsDuplicateDialogOpen(false); setDuplicateTenant(null); }} className="h-8">Fechar</Button>
          {onShowCustomer && duplicateCustomer && (
            <Button
              className="h-8"
              onClick={() => {
                onShowCustomer(duplicateCustomer);
                setIsDuplicateDialogOpen(false);
                setDuplicateTenant(null);
                onOpenChange(false);
              }}
            >
              Visualizar Cliente
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}