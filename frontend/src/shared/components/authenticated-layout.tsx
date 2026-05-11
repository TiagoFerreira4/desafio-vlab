import { Outlet } from "react-router-dom";

import { useAuth } from "../../features/auth/auth-context";

export function AuthenticatedLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">CourseSphere</p>
          <strong>{user?.name}</strong>
        </div>

        <button className="secondary-button" onClick={logout} type="button">
          Sair
        </button>
      </header>

      <Outlet />
    </div>
  );
}
