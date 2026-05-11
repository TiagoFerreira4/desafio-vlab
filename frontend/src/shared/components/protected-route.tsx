import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../features/auth/auth-context";

export function ProtectedRoute() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return (
      <main className="centered-page">
        <p>Carregando...</p>
      </main>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}
