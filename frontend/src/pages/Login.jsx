import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const demoUsers = [
  ["customer@example.com", "Customer"],
  ["owner@example.com", "Restaurant"],
  ["rider@example.com", "Rider"],
  ["rider2@example.com", "Rider Two"],
  ["rider3@example.com", "Rider Three"],
  ["admin@example.com", "Admin"],
];

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("customer@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("Login failed. Check that the backend is running and seed data exists.");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <form className="w-full max-w-sm rounded-md border border-slate-200 bg-white p-6" onSubmit={handleSubmit}>
        <h1 className="text-xl font-semibold">Real-Time Delivery</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in with a seeded demo account.</p>

        <label className="mt-5 block text-sm font-medium">Email</label>
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label className="mt-4 block text-sm font-medium">Password</label>
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button className="mt-5 w-full rounded-md bg-slate-900 px-4 py-2 text-white" type="submit">
          Login
        </button>
        <p className="mt-4 text-center text-sm">
  Don't have an account?{" "}
  <a
    href="/register"
    className="text-blue-600"
  >
    Register
  </a>
</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {demoUsers.map(([demoEmail, label]) => (
            <button
              className="rounded-md border border-slate-300 px-2 py-2 text-sm hover:bg-slate-50"
              key={demoEmail}
              onClick={() => setEmail(demoEmail)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </form>
    </main>
  );
}
