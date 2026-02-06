import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCartStore } from '../state/cartStore';
import { usePlaceOrder } from '../hooks/usePlaceOrder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { formatMoney } from '../utils/money';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalEstimate, clearCart } = useCartStore();
  const { mutate: placeOrder, isPending } = usePlaceOrder();

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    fullAddress: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerDetails.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!customerDetails.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!customerDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!customerDetails.fullAddress.trim()) {
      newErrors.fullAddress = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    const orderItems = items.map((item) => ({
      productId: item.productId,
      quantity: BigInt(item.quantity),
      unitPriceAtOrder: item.unitPriceAtOrder,
    }));

    placeOrder(
      { items: orderItems, customer: customerDetails },
      {
        onSuccess: (orderId) => {
          clearCart();
          navigate({ to: '/order-success/$orderId', params: { orderId: orderId.toString() } });
        },
        onError: (error) => {
          toast.error('Failed to place order: ' + error.message);
        },
      }
    );
  };

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to your cart to continue.</p>
          <Button onClick={() => navigate({ to: '/' })}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId.toString()} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium">Product #{item.productId.toString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatMoney(item.unitPriceAtOrder)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.productId, Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-20"
                      />
                      <p className="font-semibold w-24 text-right">
                        {formatMoney(item.unitPriceAtOrder * BigInt(item.quantity))}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Estimate:</span>
                  <span className="text-primary">{formatMoney(getTotalEstimate())}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Details Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    value={customerDetails.fullAddress}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, fullAddress: e.target.value })}
                    rows={4}
                    className={errors.fullAddress ? 'border-destructive' : ''}
                  />
                  {errors.fullAddress && <p className="text-sm text-destructive mt-1">{errors.fullAddress}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
