import { useProducts } from '../hooks/useProducts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Package } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../state/cartStore';
import { formatMoney } from '../utils/money';
import { getProductImageUrl } from '../utils/images';
import HeroSection from '../components/marketing/HeroSection';
import { toast } from 'sonner';

export default function CatalogPage() {
  const { data: products, isLoading } = useProducts();
  const addItem = useCartStore((state) => state.addItem);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleAddToCart = (productId: bigint, name: string, price: bigint) => {
    const quantity = quantities[productId.toString()] || 1;
    addItem(productId, quantity, price);
    toast.success(`Added ${quantity}x ${name} to cart`);
    setQuantities((prev) => ({ ...prev, [productId.toString()]: 1 }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      <div className="container py-12">
        <h2 className="text-3xl font-bold mb-8">Our Products</h2>
        {!products || products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
            <p className="text-muted-foreground">Check back soon for new products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id.toString()} className="flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={getProductImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = getProductImageUrl('');
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  <p className="text-2xl font-bold text-primary">{formatMoney(product.price)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={quantities[product.id.toString()] || 1}
                    onChange={(e) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id.toString()]: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    className="w-20"
                  />
                  <Button
                    onClick={() => handleAddToCart(product.id, product.name, product.price)}
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
