import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/shared/lib/auth';

export default function ProtectedLayout() {
  const location = useLocation();
  if (!isAuthenticated()) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
