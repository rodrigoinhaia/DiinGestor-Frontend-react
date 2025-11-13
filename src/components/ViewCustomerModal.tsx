import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { Customer } from '@/services/customersService';

interface ViewCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

export function ViewCustomerModal({ open, onOpenChange, customer }: ViewCustomerModalProps) {
  if (!customer) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
          <DialogDescription>
            Informações completas do cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {/* Status */}
          <div>
            <Badge variant={customer.isActive ? 'default' : 'secondary'} className="text-sm">
              {customer.isActive ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>

          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Informações Básicas</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Razão Social</Label>
                <p className="mt-1 font-medium">{customer.name}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">CNPJ</Label>
                <p className="mt-1 font-medium font-mono">{customer.document}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="mt-1">{customer.email}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Telefone</Label>
                <p className="mt-1">{customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Endereço</h3>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <Label className="text-muted-foreground">Logradouro</Label>
                <p className="mt-1">{customer.address.street}, {customer.address.number}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">CEP</Label>
                <p className="mt-1 font-mono">{customer.address.zipCode}</p>
              </div>
            </div>

            {customer.address.complement && (
              <div>
                <Label className="text-muted-foreground">Complemento</Label>
                <p className="mt-1">{customer.address.complement}</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-muted-foreground">Bairro</Label>
                <p className="mt-1">{customer.address.neighborhood}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Cidade</Label>
                <p className="mt-1">{customer.address.city}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Estado</Label>
                <p className="mt-1">{customer.address.state}</p>
              </div>
            </div>
          </div>

          {/* Informações do Sistema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Informações do Sistema</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Cadastrado em</Label>
                <p className="mt-1">{formatDate(customer.createdAt)}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Última atualização</Label>
                <p className="mt-1">{formatDate(customer.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
