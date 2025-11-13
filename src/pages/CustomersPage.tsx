import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateCustomerModal } from '@/components/CreateCustomerModal';
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
import { useCustomers } from '@/hooks/useCustomers';
import type { Customer } from '@/services/customersService';

// Dados mockados para desenvolvimento - fallback se API falhar
const mockCustomers = [
  {
    id: '1',
    name: 'Tech Solutions LTDA',
    email: 'contato@techsolutions.com.br',
    phone: '(11) 99999-9999',
    document: '12.345.678/0001-90',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    contractsCount: 3,
    totalValue: 8500.00
  },
  {
    id: '2',
    name: 'Inovação Digital ME',
    email: 'admin@inovacaodigital.com',
    phone: '(21) 88888-8888',
    document: '98.765.432/0001-10',
    isActive: true,
    createdAt: '2024-02-20T14:30:00Z',
    contractsCount: 1,
    totalValue: 2800.00
  },
  {
    id: '3',
    name: 'StartUp Tech',
    email: 'hello@startuptech.io',
    phone: '(31) 77777-7777',
    document: '11.222.333/0001-44',
    isActive: false,
    createdAt: '2024-03-10T09:15:00Z',
    contractsCount: 0,
    totalValue: 0
  },
  {
    id: '4',
    name: 'Consultoria ABC',
    email: 'contato@consultoriaabc.com.br',
    phone: '(41) 66666-6666',
    document: '55.666.777/0001-88',
    isActive: true,
    createdAt: '2024-03-25T16:45:00Z',
    contractsCount: 2,
    totalValue: 5200.00
  }
];

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Buscar dados reais da API
  const { data: apiCustomers, isLoading, isError } = useCustomers();

  // Em desenvolvimento usamos dados mockados
  // const { data: customers, isLoading, error } = useCustomers({
  //   page: currentPage,
  //   limit: 10,
  //   search: searchTerm
  // });

  // Usar dados da API se disponível, senão usar mock
  const customers = Array.isArray(apiCustomers)
    ? apiCustomers
    : Array.isArray((apiCustomers as any)?.customers)
      ? (apiCustomers as any).customers
      : mockCustomers;
  
  const filteredCustomers = customers.filter((customer: Customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.document.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

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
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Carregando clientes...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground text-red-600">Erro ao carregar dados - usando dados offline</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes e informações de contato
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              Todos os clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter((c: Customer) => c.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Com contratos vigentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(customers.reduce((acc: number, c: Customer & { totalValue?: number }) => acc + (c.totalValue || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total dos contratos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os seus clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contratos</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer: Customer & { contractsCount?: number; totalValue?: number }) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{customer.email}</div>
                        <div className="text-muted-foreground">{customer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {customer.document}
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                        {customer.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.contractsCount || 0}</TableCell>
                    <TableCell>{formatCurrency(customer.totalValue || 0)}</TableCell>
                    <TableCell>{formatDate(customer.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum cliente encontrado com os filtros aplicados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para criar cliente */}
      <CreateCustomerModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />
    </div>
  );
}