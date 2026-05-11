import { BookOpenCheck, LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";

import { useAuth } from "../../features/auth/auth-context";

export function AuthenticatedLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <span className="brand-mark" aria-hidden="true">
            <BookOpenCheck size={22} />
          </span>
          <div>
            <p className="eyebrow">CourseSphere</p>
            <strong>{user?.name}</strong>
          </div>
        </div>

        <button className="secondary-button" onClick={logout} type="button">
          <LogOut aria-hidden="true" size={18} />
          Sair
        </button>
      </header>

      <Outlet />
    </div>
  );
}
