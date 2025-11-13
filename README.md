# DiinGestor Frontend

Frontend React para o sistema DiinGestor - Sistema completo de gestão empresarial com foco em revenda de software e gestão de licenças.

## 🚀 Tecnologias

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **Shadcn/UI** - Biblioteca de componentes
- **React Router** - Roteamento
- **TanStack Query** - Gerenciamento de estado servidor
- **Zustand** - Gerenciamento de estado client
- **Axios** - Cliente HTTP
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes do Shadcn/UI
│   ├── AppSidebar.tsx  # Sidebar da aplicação
│   ├── Header.tsx      # Header principal
│   ├── DashboardLayout.tsx # Layout do dashboard
│   └── ProtectedRoute.tsx  # Proteção de rotas
├── contexts/           # Contextos React
│   └── QueryProvider.tsx # Provider do TanStack Query
├── hooks/              # Hooks customizados
│   ├── useAuth.ts      # Hook de autenticação
│   └── useCustomers.ts # Hook de clientes
├── lib/                # Utilitários
│   └── utils.ts        # Funções utilitárias
├── pages/              # Páginas da aplicação
│   └── LoginPage.tsx   # Página de login
├── router/             # Configuração de rotas
│   └── index.tsx       # Rotas principais
├── services/           # Serviços de API
│   ├── api.ts          # Cliente HTTP base
│   ├── auth.ts         # Serviços de autenticação
│   └── customers.ts    # Serviços de clientes
├── store/              # Gerenciamento de estado
│   └── auth.ts         # Store de autenticação
└── types/              # Definições TypeScript
    └── api.ts          # Tipos da API
```

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd DiinGestor-Frontend-react
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=https://backendgestor.sdbr.app/api/v1
```

### 4. Execute o projeto em desenvolvimento
```bash
npm run dev
```

### 5. Construa para produção
```bash
npm run build
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa o servidor de desenvolvimento
- `npm run build` - Constrói a aplicação para produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter

## 📋 Funcionalidades

### ✅ Implementadas
- [x] Configuração base do projeto com Vite + React + TypeScript
- [x] Sistema de autenticação JWT completo
- [x] Layout responsivo com Shadcn/UI
- [x] Roteamento protegido
- [x] Gerenciamento de estado global (Zustand + TanStack Query)
- [x] Cliente HTTP configurado com interceptadores
- [x] Estrutura de componentes base

### 🚧 Próximas Funcionalidades
- [ ] Dashboard com métricas financeiras
- [ ] Gestão completa de clientes
- [ ] Gestão de planos de software
- [ ] Sistema de contratos e licenças
- [ ] Módulo de faturas e cobrança
- [ ] Sistema de tickets/suporte
- [ ] Relatórios financeiros avançados

## 🌐 Integração com Backend

O frontend foi projetado para integrar com a API DiinGestor (https://backendgestor.sdbr.app/api/docs).

### Principais módulos integrados:
- **Autenticação** - Login, registro, verificação de token
- **Clientes** - Cadastro e gestão de clientes
- **Planos** - Gestão de planos de software
- **Contratos** - Gestão de contratos de licença
- **Faturas** - Sistema de faturamento
- **Financeiro** - Métricas MRR, ARR e análises
- **Tickets** - Sistema de suporte
- **Assinaturas** - Gestão de recorrências

## 🎨 Design System

Baseado no Shadcn/UI com:
- Tema customizável (claro/escuro)
- Componentes acessíveis
- Design responsivo mobile-first
- Variáveis CSS para personalização

## 🔒 Segurança

- JWT tokens com refresh automático
- Rotas protegidas por autenticação
- Interceptadores HTTP para tratamento de erros
- Logout automático em caso de token expirado

## 🚀 Como Executar

1. **O backend está disponível** em https://backendgestor.sdbr.app
2. **Execute o frontend**:
   ```bash
   npm run dev
   ```
3. **Acesse** http://localhost:5173

## 📱 Login de Teste

Use as credenciais do seu backend ou crie uma conta através da tela de registro.

---

**DiinGestor Frontend** - Interface moderna e responsiva para gestão empresarial completa.
