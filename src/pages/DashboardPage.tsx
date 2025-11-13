import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

// Dados mockados - depois serão substituídos por dados reais da API
const mockStats = {
  totalCustomers: 156,
  activeContracts: 89,
  monthlyRevenue: 45780.50,
  pendingInvoices: 12,
  openTickets: 7,
  churnRate: 2.1,
  growth: {
    customers: 12.5,
    revenue: 8.3,
    contracts: 15.2
  }
};

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  trendValue 
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down';
  trendValue?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center text-xs text-muted-foreground">
        {description}
        {trendValue && (
          <Badge 
            variant={trend === 'up' ? 'default' : 'secondary'} 
            className="ml-2"
          >
            {trend === 'up' ? '+' : ''}{trendValue}%
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

const RecentActivity = () => (
  <Card>
    <CardHeader>
      <CardTitle>Atividades Recentes</CardTitle>
      <CardDescription>
        Últimas ações realizadas no sistema
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center space-x-3">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            Contrato #1234 foi ativado
          </p>
          <p className="text-xs text-muted-foreground">
            Cliente: Tech Solutions LTDA
          </p>
        </div>
        <span className="text-xs text-muted-foreground">2h atrás</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <DollarSign className="h-4 w-4 text-green-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            Fatura #5678 foi paga
          </p>
          <p className="text-xs text-muted-foreground">
            R$ 2.850,00 - Plano Premium
          </p>
        </div>
        <span className="text-xs text-muted-foreground">4h atrás</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            Novo ticket de suporte aberto
          </p>
          <p className="text-xs text-muted-foreground">
            Problema de integração - Alta prioridade
          </p>
        </div>
        <span className="text-xs text-muted-foreground">6h atrás</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <Users className="h-4 w-4 text-blue-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            Novo cliente cadastrado
          </p>
          <p className="text-xs text-muted-foreground">
            Inovação Digital ME
          </p>
        </div>
        <span className="text-xs text-muted-foreground">1d atrás</span>
      </div>
    </CardContent>
  </Card>
);

const QuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Ações Rápidas</CardTitle>
      <CardDescription>
        Acesso rápido às funcionalidades principais
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <Users className="h-6 w-6 text-blue-500 mb-2" />
          <span className="text-sm font-medium">Novo Cliente</span>
        </button>
        
        <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <FileText className="h-6 w-6 text-green-500 mb-2" />
          <span className="text-sm font-medium">Novo Contrato</span>
        </button>
        
        <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <DollarSign className="h-6 w-6 text-yellow-500 mb-2" />
          <span className="text-sm font-medium">Gerar Fatura</span>
        </button>
        
        <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <Target className="h-6 w-6 text-purple-500 mb-2" />
          <span className="text-sm font-medium">Novo Plano</span>
        </button>
      </div>
    </CardContent>
  </Card>
);

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu negócio e métricas importantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Clientes"
          value={mockStats.totalCustomers}
          description="Clientes ativos"
          icon={Users}
          trend="up"
          trendValue={mockStats.growth.customers.toString()}
        />
        
        <StatCard
          title="Contratos Ativos"
          value={mockStats.activeContracts}
          description="Contratos em vigor"
          icon={FileText}
          trend="up"
          trendValue={mockStats.growth.contracts.toString()}
        />
        
        <StatCard
          title="Receita Mensal"
          value={`R$ ${mockStats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          description="MRR atual"
          icon={DollarSign}
          trend="up"
          trendValue={mockStats.growth.revenue.toString()}
        />
        
        <StatCard
          title="Tickets Abertos"
          value={mockStats.openTickets}
          description="Requer atenção"
          icon={AlertCircle}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando pagamento
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.churnRate}%</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7</div>
            <p className="text-xs text-muted-foreground">
              Satisfação do cliente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}