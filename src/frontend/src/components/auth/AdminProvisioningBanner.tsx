import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAdminStatus } from '../../hooks/useAdminStatus';
import { useLocation } from '@tanstack/react-router';

export default function AdminProvisioningBanner() {
  const { identity } = useInternetIdentity();
  const { isAdmin, isLoading: adminStatusLoading } = useAdminStatus();
  const location = useLocation();

  const isAuthenticated = !!identity;
  const isAdminLoginPage = location.pathname === '/admin/login';
  
  // Only show banner on admin login page for authenticated non-admin users
  const shouldShowBanner = isAuthenticated && !adminStatusLoading && !isAdmin && isAdminLoginPage;

  // Banner is now integrated into AdminLoginPage, so this component renders nothing
  // Keeping it for backwards compatibility but it's effectively disabled
  if (!shouldShowBanner) {
    return null;
  }

  return null;
}
