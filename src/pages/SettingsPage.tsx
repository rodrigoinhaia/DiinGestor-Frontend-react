import React, { useState } from 'react';
import { Save, User, Lock, Bell, CreditCard, Shield, Globe, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Configure as preferências do sistema e conta
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Faturamento
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e preferências da conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input id="firstName" placeholder="Seu nome" defaultValue="João" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input id="lastName" placeholder="Seu sobrenome" defaultValue="Silva" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" defaultValue="joao@empresa.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" placeholder="Nome da empresa" defaultValue="Minha Empresa Ltda." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 99999-9999" defaultValue="(11) 98765-4321" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você..."
                  defaultValue="Gestor de software especializado em soluções empresariais."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select defaultValue="america/sao_paulo">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o fuso horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america/sao_paulo">América/São Paulo</SelectItem>
                    <SelectItem value="america/new_york">América/New York</SelectItem>
                    <SelectItem value="europe/london">Europa/Londres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Mantenha sua conta segura com uma senha forte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>
                  <Lock className="mr-2 h-4 w-4" />
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Autenticação de Dois Fatores</CardTitle>
                <CardDescription>
                  Adicione uma camada extra de segurança à sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Autenticação SMS</div>
                    <div className="text-sm text-muted-foreground">
                      Receba códigos via SMS no seu celular
                    </div>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">App Autenticador</div>
                    <div className="text-sm text-muted-foreground">
                      Use um aplicativo como Google Authenticator
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessões Ativas</CardTitle>
                <CardDescription>
                  Gerencie onde você está logado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Chrome no Windows</div>
                      <div className="text-sm text-muted-foreground">
                        São Paulo, Brasil • Última atividade há 2 minutos
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Atual
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Safari no iPhone</div>
                      <div className="text-sm text-muted-foreground">
                        São Paulo, Brasil • Última atividade há 1 dia
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Encerrar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como e quando você quer receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Notificações por E-mail</div>
                    <div className="text-sm text-muted-foreground">
                      Receba atualizações importantes por e-mail
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Faturas Vencendo</div>
                    <div className="text-sm text-muted-foreground">
                      Alertas sobre faturas próximas do vencimento
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Novos Contratos</div>
                    <div className="text-sm text-muted-foreground">
                      Notificações sobre novos contratos criados
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Relatórios Semanais</div>
                    <div className="text-sm text-muted-foreground">
                      Resumo semanal de atividades e métricas
                    </div>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Notificações Push</div>
                    <div className="text-sm text-muted-foreground">
                      Receba notificações no navegador
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Cobrança</CardTitle>
                <CardDescription>
                  Gerencie suas informações de pagamento e histórico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="billingName">Nome no Cartão</Label>
                    <Input id="billingName" defaultValue="João Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input id="cardNumber" placeholder="**** **** **** 1234" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Validade</Label>
                    <Input id="expiry" placeholder="MM/AA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingCountry">País</Label>
                    <Select defaultValue="br">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="br">Brasil</SelectItem>
                        <SelectItem value="us">Estados Unidos</SelectItem>
                        <SelectItem value="ca">Canadá</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Cobrança</CardTitle>
                <CardDescription>
                  Visualize e baixe suas faturas anteriores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Fatura #{2024 - i}-{String(12 - i).padStart(3, '0')}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(2024, 11 - i, 15).toLocaleDateString('pt-BR')} • R$ 99,90
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Pago
                        </span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências do Sistema</CardTitle>
                <CardDescription>
                  Configure as opções gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Tema Escuro</div>
                    <div className="text-sm text-muted-foreground">
                      Ative o modo escuro da interface
                    </div>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select defaultValue="pt-br">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                      <SelectItem value="en-us">English (US)</SelectItem>
                      <SelectItem value="es-es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Formato de Data</Label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                      <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda Padrão</Label>
                  <Select defaultValue="brl">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brl">Real (R$)</SelectItem>
                      <SelectItem value="usd">Dólar ($)</SelectItem>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup e Exportação</CardTitle>
                <CardDescription>
                  Faça backup dos seus dados ou exporte informações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Backup Automático</div>
                    <div className="text-sm text-muted-foreground">
                      Último backup: 2 dias atrás
                    </div>
                  </div>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Fazer Backup
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Exportar Dados</div>
                    <div className="text-sm text-muted-foreground">
                      Baixe todos os seus dados em formato JSON
                    </div>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zona de Perigo</CardTitle>
                <CardDescription>
                  Ações irreversíveis que afetam sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <div className="font-medium text-red-800">Excluir Conta</div>
                      <div className="text-sm text-red-600">
                        Esta ação não pode ser desfeita. Todos os dados serão perdidos.
                      </div>
                    </div>
                    <Button variant="destructive">
                      Excluir Conta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}