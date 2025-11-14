import { useState } from 'react';
import { Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSystems } from '@/hooks/useSystems';
import { useModules } from '@/hooks/useModules';
import { CreateSystemModal } from '@/components/CreateSystemModal';
import { EditSystemModal } from '@/components/EditSystemModal';
import { CreateModuleModal } from '@/components/CreateModuleModal';
import { EditModuleModal } from '@/components/EditModuleModal';
import type { System, Module } from '@/types/api';

export function ProductsSystemsPage() {
  const [activeTab, setActiveTab] = useState('modules');
  const [isCreateSystemOpen, setIsCreateSystemOpen] = useState(false);
  const [isEditSystemOpen, setIsEditSystemOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [isEditModuleOpen, setIsEditModuleOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const { data: systems = [], isLoading: isLoadingSystems } = useSystems();
  const { data: modules = [], isLoading: isLoadingModules } = useModules();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleEditSystem = (system: System) => {
    setSelectedSystem(system);
    setIsEditSystemOpen(true);
  };

  const handleEditModule = (module: Module) => {
    setSelectedModule(module);
    setIsEditModuleOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Settings className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cadastros - Produtos e Planos</h1>
            <p className="text-muted-foreground">
              Gerencie módulos e sistemas para configuração de planos
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="modules">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            MÓDULOS
          </TabsTrigger>
          <TabsTrigger value="systems">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            SISTEMAS
          </TabsTrigger>
        </TabsList>

        {/* Módulos Tab */}
        <TabsContent value="modules" className="space-y-4">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Módulos do Sistema ({modules.length})</CardTitle>
                  <CardDescription>
                    Lista de todos os módulos cadastrados com preços
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsCreateModuleOpen(true)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4" />
                  Novo Módulo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingModules ? (
                <div className="text-center py-8">Carregando módulos...</div>
              ) : modules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum módulo cadastrado
                </div>
              ) : (
                <div className="rounded-lg border shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sistema</TableHead>
                        <TableHead>Módulo</TableHead>
                        <TableHead>Descrição do Módulo</TableHead>
                        <TableHead className="text-right">Preço de Repasse</TableHead>
                        <TableHead className="text-right">Preço de Venda</TableHead>
                        <TableHead className="text-center">Ativo</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map((module) => (
                        <TableRow key={module.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="font-medium text-emerald-700">
                                {module.system?.name || 'Sistema não identificado'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{module.name}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {module.description || '-'}
                          </TableCell>
                          <TableCell className="text-right text-red-600 font-semibold">
                            {formatCurrency(module.costPrice)}
                          </TableCell>
                          <TableCell className="text-right text-green-600 font-semibold">
                            {formatCurrency(module.salePrice)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={module.isActive ? 'default' : 'secondary'}>
                              {module.isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditModule(module)}
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sistemas Tab */}
        <TabsContent value="systems" className="space-y-4">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sistemas Cadastrados ({systems.length})</CardTitle>
                  <CardDescription>
                    Lista de todos os sistemas disponíveis
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsCreateSystemOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Novo Sistema
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingSystems ? (
                <div className="text-center py-8">Carregando sistemas...</div>
              ) : systems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum sistema cadastrado
                </div>
              ) : (
                <div className="rounded-lg border shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sistema</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-center">Módulos</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {systems.map((system) => (
                        <TableRow key={system.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="font-semibold text-blue-700">{system.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {system.description || '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">
                              {system.modules?.length || 0} módulos
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={system.isActive ? 'default' : 'secondary'}>
                              {system.isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditSystem(system)}
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <CreateSystemModal open={isCreateSystemOpen} onOpenChange={setIsCreateSystemOpen} />
      {selectedSystem && (
        <EditSystemModal
          open={isEditSystemOpen}
          onOpenChange={setIsEditSystemOpen}
          system={selectedSystem}
        />
      )}
      <CreateModuleModal
        open={isCreateModuleOpen}
        onOpenChange={setIsCreateModuleOpen}
        systems={systems}
      />
      {selectedModule && (
        <EditModuleModal
          open={isEditModuleOpen}
          onOpenChange={setIsEditModuleOpen}
          module={selectedModule}
          systems={systems}
        />
      )}
    </div>
  );
}
