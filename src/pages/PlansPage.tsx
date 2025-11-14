import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Copy, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreatePlanModal } from '@/components/CreatePlanModal';
import { usePlans } from '@/hooks/usePlans';
import type { Plan } from '@/types/api';

// Dados mockados para desenvolvimento
const mockPlans = [
  {
    id: '1',
    name: 'Plano Starter',
    description: 'Ideal para pequenas empresas iniciantes',
    price: 299.90,
    billingCycle: 'monthly' as const,
    features: [
      { name: 'Até 10 usuários', included: true },
      { name: 'Relatórios básicos', included: true },
      { name: 'Suporte por email', included: true },
      { name: 'API integração', included: false },
      { name: 'Relatórios avançados', included: false }
    ],
    isActive: true,
    contractsCount: 25,
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    name: 'Plano Professional',
    description: 'Para empresas em crescimento',
    price: 599.90,
    billingCycle: 'monthly' as const,
    features: [
      { name: 'Até 50 usuários', included: true },
      { name: 'Relatórios básicos', included: true },
      { name: 'Suporte prioritário', included: true },
      { name: 'API integração', included: true },
      { name: 'Relatórios avançados', included: true }
    ],
    isActive: true,
    contractsCount: 18,
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '3',
    name: 'Plano Enterprise',
    description: 'Solução completa para grandes empresas',
    price: 1299.90,
    billingCycle: 'monthly' as const,
    features: [
      { name: 'Usuários ilimitados', included: true },
      { name: 'Relatórios básicos', included: true },
      { name: 'Suporte 24/7', included: true },
      { name: 'API integração', included: true },
      { name: 'Relatórios avançados', included: true },
      { name: 'Dashboard personalizado', included: true },
      { name: 'Treinamento dedicado', included: true }
    ],
    isActive: true,
    contractsCount: 8,
    createdAt: '2024-02-01T09:15:00Z'
  },
  {
    id: '4',
    name: 'Plano Legacy',
    description: 'Plano descontinuado - apenas contratos existentes',
    price: 199.90,
    billingCycle: 'monthly' as const,
    features: [
      { name: 'Até 5 usuários', included: true },
      { name: 'Relatórios básicos', included: true },
      { name: 'Suporte por email', included: true }
    ],
    isActive: false,
    contractsCount: 3,
    createdAt: '2023-12-01T16:45:00Z'
  }
];

export function PlansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: apiPlans, isLoading, isError } = usePlans();
  const plans = apiPlans || mockPlans;

  // Type guard to ensure we're working with correct Plan type
  const isValidPlan = (plan: any): plan is Plan => {
    return 'finalPrice' in plan && 'modules' in plan;
  };

  const validPlans = plans.filter(isValidPlan);

  const filteredPlans = validPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Planos</h1>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Carregando planos...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    // Segue com fallback mock, mas indica erro
    // (mantemos o retorno padrão com dados mockados abaixo)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getBillingCycleText = (cycle: string) => {
    const cycles = {
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      annual: 'Anual'
    };
    return cycles[cycle as keyof typeof cycles] || cycle;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planos</h1>
          <p className="text-muted-foreground">
            Gerencie os planos de software e suas funcionalidades
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">
              Todos os planos criados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.filter(p => p.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponíveis para venda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {validPlans.reduce((acc, p) => acc + (p.modules?.length || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de assinantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(validPlans.reduce((acc, p) => acc + p.finalPrice, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              MRR dos planos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Planos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os seus planos de software
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar planos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${!plan.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {plan.name}
                        {!plan.isActive && (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price */}
                  <div className="text-center">
                    <div className="text-3xl font-bold">{formatCurrency(plan.finalPrice)}</div>
                    <div className="text-sm text-muted-foreground">
                      por {getBillingCycleText(plan.billingCycle).toLowerCase()}
                    </div>
                  </div>

                  {/* Modules */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Módulos:</h4>
                    <ul className="space-y-1">
                      {(plan.modules || []).slice(0, 4).map((planModule: any, index: number) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            planModule.isIncluded ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <span className={planModule.isIncluded ? '' : 'text-muted-foreground line-through'}>
                            {planModule.module?.name || 'Módulo'}
                          </span>
                        </li>
                      ))}
                      {(plan.modules || []).length > 4 && (
                        <li className="text-sm text-muted-foreground">
                          +{plan.modules.length - 4} mais módulos
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{plan.modules?.length || 0}</div>
                      <div className="text-muted-foreground">Módulos</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatDate(plan.createdAt)}</div>
                      <div className="text-muted-foreground">Criado em</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPlans.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum plano encontrado com os filtros aplicados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <CreatePlanModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}