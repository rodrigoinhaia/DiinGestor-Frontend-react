import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Eye, Send, RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Dados mockados para desenvolvimento
const mockInvoices = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customerName: 'Tech Solutions Ltda.',
    contractNumber: 'CTR-2024-001',
    planName: 'Plano Professional',
    status: 'paid' as const,
    dueDate: '2024-12-15',
    paidDate: '2024-12-10',
    amount: 599.90,
    description: 'Mensalidade - Dezembro 2024',
    createdAt: '2024-11-15T10:00:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customerName: 'Inovação Digital S/A',
    contractNumber: 'CTR-2024-002',
    planName: 'Plano Enterprise',
    status: 'pending' as const,
    dueDate: '2024-12-01',
    paidDate: null,
    amount: 1299.90,
    description: 'Mensalidade - Dezembro 2024',
    createdAt: '2024-11-01T14:30:00Z'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customerName: 'StartUp Ventures',
    contractNumber: 'CTR-2024-003',
    planName: 'Plano Starter',
    status: 'overdue' as const,
    dueDate: '2024-11-15',
    paidDate: null,
    amount: 299.90,
    description: 'Mensalidade - Novembro 2024',
    createdAt: '2024-10-15T09:15:00Z'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    customerName: 'Global Business Inc.',
    contractNumber: 'CTR-2024-004',
    planName: 'Plano Professional',
    status: 'cancelled' as const,
    dueDate: '2024-09-01',
    paidDate: null,
    amount: 599.90,
    description: 'Mensalidade - Setembro 2024',
    createdAt: '2024-08-01T11:30:00Z'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    customerName: 'Tech Solutions Ltda.',
    contractNumber: 'CTR-2024-001',
    planName: 'Plano Professional',
    status: 'draft' as const,
    dueDate: '2025-01-15',
    paidDate: null,
    amount: 599.90,
    description: 'Mensalidade - Janeiro 2025',
    createdAt: '2024-12-01T08:00:00Z'
  }
];

export function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.contractNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
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

  const getStatusIcon = (status: string) => {
    const icons = {
      paid: CheckCircle,
      pending: Clock,
      overdue: AlertCircle,
      cancelled: XCircle,
      draft: RefreshCw
    };
    const IconComponent = icons[status as keyof typeof icons] || Clock;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-blue-100 text-blue-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusText = (status: string) => {
    const texts = {
      paid: 'Pago',
      pending: 'Pendente',
      overdue: 'Em Atraso',
      cancelled: 'Cancelado',
      draft: 'Rascunho'
    };
    return texts[status as keyof typeof texts] || status;
  };

  // Estatísticas
  const totalInvoices = mockInvoices.length;
  const paidInvoices = mockInvoices.filter(i => i.status === 'paid').length;
  const overdueInvoices = mockInvoices.filter(i => i.status === 'overdue').length;
  const monthlyRevenue = mockInvoices
    .filter(i => i.status === 'paid')
    .reduce((acc, i) => acc + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faturas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as faturas e cobranças dos seus clientes
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Fatura
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Faturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Todas as faturas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Recebidas com sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Recebida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Valor das faturas pagas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Faturas</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as faturas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar faturas..."
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
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="overdue">Em Atraso</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
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
                  <TableHead>Número da Fatura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.contractNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{invoice.planName}</TableCell>
                    <TableCell>
                      <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {getStatusText(invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                    <TableCell>
                      <div className={`${
                        invoice.status === 'overdue' ? 'text-red-600' : ''
                      }`}>
                        {formatDate(invoice.dueDate)}
                      </div>
                      {invoice.paidDate && (
                        <div className="text-sm text-green-600">
                          Pago em {formatDate(invoice.paidDate)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {invoice.status === 'draft' && (
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhuma fatura encontrada com os filtros aplicados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}