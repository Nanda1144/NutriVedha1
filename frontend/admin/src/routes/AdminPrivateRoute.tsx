import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface AdminPrivateRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const AdminPrivateRoute: React.FC<AdminPrivateRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const { isAuthenticated, isLoading, admin, hasPermission, verifySession } = useAdminAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && !admin) {
      verifySession();
    }
  }, [isAuthenticated, admin, verifySession]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <LoadingSpinner size="lg" text="Authenticating enterprise administrator..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white border border-state-error/30 rounded-xl p-6 shadow-earth-md space-y-3">
          <div className="w-10 h-10 rounded-full bg-state-error/15 text-state-error flex items-center justify-center mx-auto font-bold">
            !
          </div>
          <h2 className="text-base font-bold text-charcoal">Unauthorized Operation</h2>
          <p className="text-xs text-warm-brown">
            Your administrative role does not have authorization for permission code <code className="bg-sand/30 px-1 py-0.5 rounded text-charcoal">{requiredPermission}</code>.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
