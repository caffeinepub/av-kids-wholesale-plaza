import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Package, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import { useAdminStatus } from '../../hooks/useAdminStatus';
import { useCartStore } from '../../state/cartStore';

export default function Header() {
  const navigate = useNavigate();
  const { isAdmin, hasChecked } = useAdminStatus();
  const cartItemCount = useCartStore((state) => state.items.length);

  // Only show admin links when we have a definitive admin status
  const showAdminLinks = hasChecked && isAdmin;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <img 
              src="/assets/generated/shop-logo.dim_512x512.png" 
              alt="Av Kids Wholesale Plaza Logo" 
              className="h-10 w-auto object-contain" 
            />
            <span className="hidden sm:inline">Av Kids Wholesale Plaza</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
            >
              Catalog
            </Link>
            {showAdminLinks && (
              <>
                <Link
                  to="/admin/products"
                  className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary flex items-center gap-1"
                >
                  <Package className="h-4 w-4" />
                  Products
                </Link>
                <Link
                  to="/admin/orders"
                  className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary flex items-center gap-1"
                >
                  <ClipboardList className="h-4 w-4" />
                  Orders
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: '/checkout' })}
            className="relative"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
