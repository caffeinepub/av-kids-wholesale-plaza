import { useOrders } from '../../hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ClipboardList } from 'lucide-react';
import { formatMoney } from '../../utils/money';

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useOrders();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      ) : !orders || orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <ClipboardList className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground">Orders will appear here once customers start placing them.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id.toString()}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Order #{order.id.toString()}</CardTitle>
                  <Badge variant="outline">{formatDate(order.createdAt)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer Details */}
                  <div>
                    <h3 className="font-semibold mb-3">Customer Details</h3>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Name</dt>
                        <dd className="font-medium">{order.customer.name}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Email</dt>
                        <dd className="font-medium">{order.customer.email}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd className="font-medium">{order.customer.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Address</dt>
                        <dd className="font-medium whitespace-pre-line">{order.customer.fullAddress}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Product #{item.productId.toString()} × {item.quantity.toString()}
                          </span>
                          <span className="font-medium">
                            {formatMoney(item.unitPriceAtOrder * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold text-base">
                        <span>Total Estimate</span>
                        <span className="text-primary">{formatMoney(order.totalEstimate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
