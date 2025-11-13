import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Componentes temporários para desenvolvimento
const DashboardPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1></div>;
const CustomersPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Clientes</h1></div>;
const PlansPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Planos</h1></div>;
const ContractsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Contratos</h1></div>;
const InvoicesPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Faturas</h1></div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'customers',
        element: <CustomersPage />,
      },
      {
        path: 'plans',
        element: <PlansPage />,
      },
      {
        path: 'contracts',
        element: <ContractsPage />,
      },
      {
        path: 'invoices',
        element: <InvoicesPage />,
      },
    ],
  },
]);