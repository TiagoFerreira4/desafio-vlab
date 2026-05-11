import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../features/auth/auth-context";

export function PublicRoute() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <main className="centered-page">
        <p>Carregando...</p>
      </main>
    );
  }

  if (auth.isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}
