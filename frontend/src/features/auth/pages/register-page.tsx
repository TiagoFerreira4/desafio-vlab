import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAuthErrorMessage } from "../auth-errors";
import { useAuth } from "../auth-context";

export function RegisterPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("Preencha nome, email e senha.");
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      await auth.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigate("/dashboard", { replace: true });
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="register-title">
        <div className="auth-copy">
          <p className="eyebrow">CourseSphere</p>
          <h1 id="register-title">Criar conta</h1>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              autoComplete="name"
              name="name"
              onChange={(event) => setName(event.target.value)}
              type="text"
              value={name}
            />
          </label>

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
              autoComplete="new-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="auth-switch">
          Ja tenho conta. <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
