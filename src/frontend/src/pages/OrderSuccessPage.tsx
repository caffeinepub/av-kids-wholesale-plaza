import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  const { orderId } = useParams({ from: '/order-success/$orderId' });
  const navigate = useNavigate();

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Thank you for your order. Your order has been received and is being processed.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="text-lg font-mono font-semibold">#{orderId}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              We'll contact you soon with further details about your order.
            </p>
            <Button onClick={() => navigate({ to: '/' })} className="w-full">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
