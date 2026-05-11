import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getAuthErrorMessage } from "../auth-errors";
import { useAuth } from "../auth-context";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Informe email e senha.");
      return;
    }

    setIsSubmitting(true);

    try {
      await auth.login({
        email: email.trim(),
        password,
      });

      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname ?? "/dashboard", { replace: true });
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <div className="auth-copy">
          <p className="eyebrow">CourseSphere</p>
          <h1 id="login-title">Entrar</h1>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              autoComplete="email"
              inputMode="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
          </label>

          <label>
            Senha
            <input
              autoComplete="current-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button disabled={isSubmitting} type="submit">
            <LogIn aria-hidden="true" size={18} />
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-switch">
          Ainda nao tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </section>
    </main>
  );
}
