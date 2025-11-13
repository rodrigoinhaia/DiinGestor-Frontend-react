import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { PlansPage } from '@/pages/PlansPage';
import { ContractsPage } from '@/pages/ContractsPage';
import { InvoicesPage } from '@/pages/InvoicesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

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
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);