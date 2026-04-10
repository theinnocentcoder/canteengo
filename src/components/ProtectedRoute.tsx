import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import type { Enums } from '@/integrations/supabase/types';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  children: React.ReactNode;
  allowedRoles?: Enums<'app_role'>[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 w-64">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  return <>{children}</>;
}
