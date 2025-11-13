import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Save, X, Search } from 'lucide-react';
import { cnpjService } from '@/services/cnpjService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useCustomer, useUpdateCustomer, useDeleteCustomer } from '@/hooks/useCustomers';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSearchingCNPJ, setIsSearchingCNPJ] = useState(false);
  
  const { data: customer, isLoading, isError, refetch } = useCustomer(id!);
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  // Debug: log do cliente carregado
  console.log('👤 Cliente carregado na página:', customer);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      document: '',
      isActive: true,
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
  });

  // Atualizar formulário quando customer mudar
  useEffect(() => {
    if (customer) {
      console.log('🔄 [CustomerDetailPage] Resetando formulário com dados:', customer);
      reset({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        document: customer.document || '',
        isActive: customer.isActive ?? true,
        address: {
          street: customer.address?.street || '',
          number: customer.address?.number || '',
          complement: customer.address?.complement || '',
          neighborhood: customer.address?.neighborhood || '',
          city: customer.address?.city || '',
          state: customer.address?.state || '',
          zipCode: customer.address?.zipCode || '',
        },
      });
    }
  }, [customer, reset]);

  const isActiveValue = watch('isActive');
  const cnpjValue = watch('document');

  const handleBuscarCNPJ = async () => {
    const cnpj = cnpjValue?.replace(/[^\d]/g, '');
    
    if (!cnpj || cnpj.length !== 14) {
      toast.error('Informe um CNPJ válido com 14 dígitos');
      return;
    }

    setIsSearchingCNPJ(true);
    
    try {
      const data = await cnpjService.buscarPorCNPJ(cnpj);
      
      // Preencher campos automaticamente
      if (data.razao_social) setValue('name', data.razao_social);
      if (data.ddd_telefone_1) setValue('phone', cnpjService.formatarTelefone(data.ddd_telefone_1));
      if (data.logradouro) setValue('address.street', data.logradouro);
      if (data.numero) setValue('address.number', data.numero);
      if (data.complemento) setValue('address.complement', data.complemento);
      if (data.bairro) setValue('address.neighborhood', data.bairro);
      if (data.municipio) setValue('address.city', data.municipio);
      if (data.uf) setValue('address.state', data.uf);
      if (data.cep) setValue('address.zipCode', cnpjService.formatarCEP(data.cep));
      
      toast.success('Dados do CNPJ carregados com sucesso!');
    } catch (error) {
      const err = error as { response?: { status?: number }; code?: string };
      if (err?.response?.status === 404) {
        toast.error('CNPJ não encontrado na base de dados.');
      } else if (err?.code === 'ECONNABORTED') {
        toast.error('Tempo de busca excedido. Tente novamente.');
      } else {
        toast.error('Erro ao buscar dados do CNPJ. Verifique e tente novamente.');
      }
      console.error('Erro ao buscar CNPJ:', error);
    } finally {
      setIsSearchingCNPJ(false);
    }
  };

  const onSubmit = async (data: CustomerFormData) => {
    if (!id) return;
    
    console.log('📤 [CustomerDetailPage] Enviando update:', {
      id,
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        document: data.document,
        isActive: data.isActive,
        address: data.address,
      },
    });

    try {
      const updated = await updateMutation.mutateAsync({
        id,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          document: data.document,
          isActive: data.isActive,
          address: data.address,
        },
      });
      console.log('✅ [CustomerDetailPage] Update retornou:', updated);
      
      toast.success('Cliente atualizado com sucesso!');
      setIsEditing(false);
      
      // Forçar refetch para garantir dados atualizados
      await refetch();
      console.log('🔄 [CustomerDetailPage] Refetch realizado');
    } catch (error) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err?.response?.status === 404) {
        toast.error('Cliente não encontrado.');
      } else {
        toast.error('Erro ao atualizar cliente.');
      }
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const handleDelete = async () => {
    if (!id || !customer) return;
    
    if (!confirm(`Tem certeza que deseja excluir ${customer.name}?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Cliente excluído com sucesso!');
      navigate('/customers');
    } catch (error) {
      toast.error('Erro ao excluir cliente.');
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Carregando...</h1>
        </div>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Cliente não encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
            <p className="text-muted-foreground">{customer.document}</p>
          </div>
          <Badge variant={customer.isActive ? 'default' : 'secondary'}>
            {customer.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Informações Gerais</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Status */}
            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={isActiveValue}
                      onCheckedChange={(checked) => setValue('isActive', checked)}
                      disabled={!isEditing}
                    />
                    <Label htmlFor="isActive">Cliente {isActiveValue ? 'Ativo' : 'Inativo'}</Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Dados principais do cliente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="document">CNPJ</Label>
                    <div className="flex gap-2">
                      <Input
                        id="document"
                        {...register('document')}
                        disabled={!isEditing}
                        className="font-mono"
                        placeholder="00.000.000/0000-00"
                      />
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBuscarCNPJ}
                          disabled={isSearchingCNPJ}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          {isSearchingCNPJ ? 'Buscando...' : 'Buscar'}
                        </Button>
                      )}
                    </div>
                    {errors.document && <p className="text-sm text-red-600">{errors.document.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Razão Social</Label>
                    <Input id="name" {...register('name')} disabled={!isEditing} />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} disabled={!isEditing} />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" {...register('phone')} disabled={!isEditing} />
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>Localização da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input id="street" {...register('address.street')} disabled={!isEditing} />
                    {errors.address?.street && <p className="text-sm text-red-600">{errors.address.street.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" {...register('address.number')} disabled={!isEditing} />
                    {errors.address?.number && <p className="text-sm text-red-600">{errors.address.number.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" {...register('address.complement')} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" {...register('address.neighborhood')} disabled={!isEditing} />
                    {errors.address?.neighborhood && <p className="text-sm text-red-600">{errors.address.neighborhood.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" {...register('address.city')} disabled={!isEditing} />
                    {errors.address?.city && <p className="text-sm text-red-600">{errors.address.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" {...register('address.state')} maxLength={2} disabled={!isEditing} />
                    {errors.address?.state && <p className="text-sm text-red-600">{errors.address.state.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input id="zipCode" {...register('address.zipCode')} disabled={!isEditing} />
                    {errors.address?.zipCode && <p className="text-sm text-red-600">{errors.address.zipCode.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contratos</CardTitle>
              <CardDescription>Contratos ativos e histórico</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Faturas</CardTitle>
              <CardDescription>Faturas emitidas e pendentes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Atividades</CardTitle>
              <CardDescription>Log de alterações e ações</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
