import { ReactNode } from 'react';
import { useAdminStatus } from '../../hooks/useAdminStatus';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity } = useInternetIdentity();
  const { isAdmin, isLoading, hasChecked } = useAdminStatus();
  const navigate = useNavigate();

  // Show loading state while checking permissions
  if (isLoading || !hasChecked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!identity) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            You must be logged in as an administrator to access this page.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate({ to: '/admin/login' })}>
              Go to Admin Login
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })}>
              Go to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but not admin (only show after definitive check)
  if (!isAdmin) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You do not have administrator privileges. Only admins can access this page.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate({ to: '/admin/login' })}>
              Go to Admin Login
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })}>
              Go to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
