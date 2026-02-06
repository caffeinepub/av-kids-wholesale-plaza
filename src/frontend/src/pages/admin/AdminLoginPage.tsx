import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAdminStatus } from '../../hooks/useAdminStatus';
import { useProvisionAdmin } from '../../hooks/useProvisionAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, AlertCircle, Loader2, CheckCircle2, Package, ClipboardList } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function AdminLoginPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { isAdmin, isLoading: adminStatusLoading, hasChecked } = useAdminStatus();
  const provisionMutation = useProvisionAdmin();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleProvision = async () => {
    try {
      await provisionMutation.mutateAsync();
    } catch (error: any) {
      // Error is already logged in the mutation
    }
  };

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Access the admin area to manage products and orders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Authentication Status Section */}
            <div className="space-y-2 pb-4 border-b">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-muted-foreground">Authentication Status:</span>
                <span className={`font-semibold ${isAuthenticated ? 'text-green-600' : 'text-gray-500'}`}>
                  {isAuthenticated ? 'Signed In' : 'Signed Out'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-muted-foreground">Admin Access Status:</span>
                <span className={`font-semibold ${
                  !isAuthenticated ? 'text-gray-500' : 
                  adminStatusLoading || !hasChecked ? 'text-yellow-600' : 
                  isAdmin ? 'text-green-600' : 'text-red-600'
                }`}>
                  {!isAuthenticated ? 'N/A' : 
                   adminStatusLoading || !hasChecked ? 'Checking...' : 
                   isAdmin ? 'Admin Confirmed' : 'Not an Admin'}
                </span>
              </div>
            </div>

            {/* Not authenticated state */}
            {!isAuthenticated && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Sign in with Internet Identity to access admin features
                </p>
                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full"
                  size="lg"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login with Internet Identity'
                  )}
                </Button>
              </div>
            )}

            {/* Authenticated but checking admin status */}
            {isAuthenticated && (adminStatusLoading || !hasChecked) && (
              <div className="text-center py-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                <p className="text-sm text-muted-foreground">Checking admin status...</p>
              </div>
            )}

            {/* Authenticated and is admin */}
            {isAuthenticated && hasChecked && isAdmin && (
              <div className="space-y-4">
                <Alert className="border-green-500/50 bg-green-500/5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-900 dark:text-green-100">Admin Access Confirmed</AlertTitle>
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    You have administrator privileges. You can now manage products and orders.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-center">Access Admin Area:</p>
                  <div className="grid gap-3">
                    <Button
                      onClick={() => navigate({ to: '/admin/products' })}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Manage Products
                    </Button>
                    <Button
                      onClick={() => navigate({ to: '/admin/orders' })}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <ClipboardList className="h-4 w-4 mr-2" />
                      View Orders
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Authenticated but not admin - show provisioning */}
            {isAuthenticated && hasChecked && !isAdmin && (
              <div className="space-y-4">
                <Alert className="border-yellow-500/50 bg-yellow-500/5">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-900 dark:text-yellow-100">Not an Administrator</AlertTitle>
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    You are logged in but do not have admin privileges.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center">
                    If this is your first time setting up the admin account, you can claim admin access below:
                  </p>
                  <Button
                    onClick={handleProvision}
                    disabled={provisionMutation.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {provisionMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Provisioning Admin Access...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-5 w-5 mr-2" />
                        Claim Admin Access
                      </>
                    )}
                  </Button>

                  {provisionMutation.isError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Provisioning Failed</AlertTitle>
                      <AlertDescription>
                        {provisionMutation.error instanceof Error
                          ? provisionMutation.error.message
                          : 'Unable to grant admin access. An administrator may have already been set for this application.'}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            )}

            {/* Logout option when authenticated */}
            {isAuthenticated && (
              <div className="pt-4 border-t">
                <Button
                  onClick={async () => {
                    await clear();
                    // Clear query cache to reset admin status
                    window.location.reload();
                  }}
                  variant="ghost"
                  className="w-full"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            onClick={() => navigate({ to: '/' })}
            variant="link"
            size="sm"
          >
            ← Back to Catalog
          </Button>
        </div>
      </div>
    </div>
  );
}
