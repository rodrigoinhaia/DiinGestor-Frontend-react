import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Edit, Trash2, Save, X, Search, 
  Building2, Mail, Phone, MapPin, Calendar, 
  FileText, DollarSign, TrendingUp, Users,
  Clock, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';
import { cnpjService } from '@/services/cnpjService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header com Breadcrumb e Ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>Clientes</span>
              <span>/</span>
              <span className="text-foreground font-medium">{customer.name}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
          </div>
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

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Contratos Ativos</CardTitle>
            <FileText className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-white/70">Nenhum contrato ativo</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Receita Mensal</CardTitle>
            <DollarSign className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(0)}</div>
            <p className="text-xs text-white/70">MRR atual</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Faturas Pendentes</CardTitle>
            <AlertCircle className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-white/70">Todas em dia</p>
          </CardContent>
        </Card>

        <Card className={`border-none text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
          customer.isActive 
            ? 'bg-gradient-to-br from-purple-500 to-indigo-700 shadow-purple-500/50 hover:shadow-purple-500/60' 
            : 'bg-gradient-to-br from-gray-500 to-gray-700 shadow-gray-500/50 hover:shadow-gray-500/60'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Status</CardTitle>
            {customer.isActive ? (
              <CheckCircle2 className="h-5 w-5 text-white/80" />
            ) : (
              <XCircle className="h-5 w-5 text-white/80" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {customer.isActive ? 'Ativo' : 'Inativo'}
            </div>
            <p className="text-xs text-white/70">
              Cliente desde {formatDate(customer.createdAt)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações Rápidas */}
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Informações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">CNPJ</p>
                <p className="text-sm text-muted-foreground font-mono">{customer.document}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Endereço</p>
                <p className="text-sm text-muted-foreground">
                  {customer.address.street}, {customer.address.number}
                  {customer.address.complement && ` - ${customer.address.complement}`}
                  <br />
                  {customer.address.neighborhood}, {customer.address.city}/{customer.address.state}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Cadastrado em</p>
                <p className="text-sm text-muted-foreground">{formatDate(customer.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Clock className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Última atualização</p>
                <p className="text-sm text-muted-foreground">{formatDate(customer.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="details">Dados Cadastrais</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contratos</CardTitle>
              <CardDescription>Contratos ativos e histórico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum contrato cadastrado</p>
                <Button className="mt-4" variant="outline">
                  Novo Contrato
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Faturas</CardTitle>
              <CardDescription>Faturas emitidas e pendentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma fatura emitida</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700">Total Faturado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(0)}</div>
                <p className="text-xs text-muted-foreground">Lifetime Value</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-orange-700">Em Aberto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(0)}</div>
                <p className="text-xs text-muted-foreground">Aguardando pagamento</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-700">Inadimplência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(0)}</div>
                <p className="text-xs text-muted-foreground">Faturas vencidas</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>Últimos pagamentos recebidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum pagamento registrado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tickets de Suporte</CardTitle>
              <CardDescription>Chamados e solicitações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum ticket aberto</p>
                <Button className="mt-4" variant="outline">
                  Novo Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
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
      </Tabs>
    </div>
  );
}
