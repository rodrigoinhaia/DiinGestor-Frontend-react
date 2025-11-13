import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Download, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Dados mockados para desenvolvimento
const mockContracts = [
  {
    id: '1',
    contractNumber: 'CTR-2024-001',
    customerName: 'Tech Solutions Ltda.',
    planName: 'Plano Professional',
    status: 'active' as const,
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    monthlyValue: 599.90,
    totalValue: 7198.80,
    billingCycle: 'monthly' as const,
    autoRenew: true,
    nextBilling: '2024-12-15',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    contractNumber: 'CTR-2024-002',
    customerName: 'Inovação Digital S/A',
    planName: 'Plano Enterprise',
    status: 'active' as const,
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    monthlyValue: 1299.90,
    totalValue: 15598.80,
    billingCycle: 'monthly' as const,
    autoRenew: true,
    nextBilling: '2024-12-01',
    createdAt: '2024-01-25T14:30:00Z'
  },
  {
    id: '3',
    contractNumber: 'CTR-2024-003',
    customerName: 'StartUp Ventures',
    planName: 'Plano Starter',
    status: 'pending' as const,
    startDate: '2024-12-01',
    endDate: '2025-12-01',
    monthlyValue: 299.90,
    totalValue: 3598.80,
    billingCycle: 'monthly' as const,
    autoRenew: false,
    nextBilling: '2024-12-01',
    createdAt: '2024-11-20T09:15:00Z'
  },
  {
    id: '4',
    contractNumber: 'CTR-2023-156',
    customerName: 'Legacy Corp.',
    planName: 'Plano Legacy',
    status: 'expired' as const,
    startDate: '2023-11-01',
    endDate: '2024-11-01',
    monthlyValue: 199.90,
    totalValue: 2398.80,
    billingCycle: 'monthly' as const,
    autoRenew: false,
    nextBilling: null,
    createdAt: '2023-10-15T16:45:00Z'
  },
  {
    id: '5',
    contractNumber: 'CTR-2024-004',
    customerName: 'Global Business Inc.',
    planName: 'Plano Professional',
    status: 'cancelled' as const,
    startDate: '2024-03-01',
    endDate: '2024-09-01',
    monthlyValue: 599.90,
    totalValue: 3599.40,
    billingCycle: 'monthly' as const,
    autoRenew: false,
    nextBilling: null,
    createdAt: '2024-02-20T11:30:00Z'
  }
];

export function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredContracts = mockContracts.filter(contract => {
    const matchesSearch = 
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.planName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'Ativo',
      pending: 'Pendente',
      expired: 'Expirado',
      cancelled: 'Cancelado'
    };
    return texts[status as keyof typeof texts] || status;
  };



  // Estatísticas
  const totalContracts = mockContracts.length;
  const activeContracts = mockContracts.filter(c => c.status === 'active').length;
  const monthlyRevenue = mockContracts
    .filter(c => c.status === 'active')
    .reduce((acc, c) => acc + c.monthlyValue, 0);
  const expiringContracts = mockContracts.filter(c => {
    if (!c.nextBilling) return false;
    const nextBilling = new Date(c.nextBilling);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return nextBilling <= thirtyDaysFromNow;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os contratos de software dos seus clientes
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContracts}</div>
            <p className="text-xs text-muted-foreground">
              Todos os contratos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContracts}</div>
            <p className="text-xs text-muted-foreground">
              Em vigência
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              MRR dos contratos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo em 30 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringContracts}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contratos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os contratos de software
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contratos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="expired">Expirado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número do Contrato</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor Mensal</TableHead>
                  <TableHead>Próx. Cobrança</TableHead>
                  <TableHead>Renovação Auto</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">
                      {contract.contractNumber}
                    </TableCell>
                    <TableCell>{contract.customerName}</TableCell>
                    <TableCell>{contract.planName}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contract.status)}>
                        {getStatusText(contract.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(contract.monthlyValue)}</TableCell>
                    <TableCell>
                      {contract.nextBilling ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(contract.nextBilling)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={contract.autoRenew ? 'default' : 'secondary'}>
                        {contract.autoRenew ? 'Sim' : 'Não'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Baixar PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredContracts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum contrato encontrado com os filtros aplicados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}