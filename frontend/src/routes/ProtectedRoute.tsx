import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CircularProgress } from '@mui/material';

interface Props {
  roles?: Array<'admin' | 'judge' | 'viewer'>;
}

export default function ProtectedRoute({ roles }: Props) {
  const { user, loading, isAdmin, isJudge } = useAuth();

  if (loading) return <CircularProgress />;
  if (!user) return <Navigate to="/login" replace />;

  if (roles) {
    const allowed =
      roles.includes('admin') && isAdmin ||
      roles.includes('judge') && isJudge ||
      roles.includes('viewer');
    if (!allowed) return <Navigate to="/" replace />;
  }

  return <Outlet />;
}