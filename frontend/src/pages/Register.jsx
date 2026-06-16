import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { user, register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      if (form.role === "RIDER") {
        payload.latitude = Number(form.latitude);
        payload.longitude = Number(form.longitude);
      }

      await register(payload);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Registration failed."
      );
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6"
      >
        <h1 className="text-xl font-semibold">
          Create Account
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Register as Customer, Rider, or Restaurant Owner.
        </p>

        <label className="mt-4 block text-sm font-medium">
          Name
        </label>

        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <label className="mt-4 block text-sm font-medium">
          Email
        </label>

        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <label className="mt-4 block text-sm font-medium">
          Password
        </label>

        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <label className="mt-4 block text-sm font-medium">
          Role
        </label>

        <select
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="RIDER">Rider</option>
          <option value="RESTAURANT_OWNER">
            Restaurant Owner
          </option>
        </select>

        {form.role === "RIDER" && (
          <>
            <label className="mt-4 block text-sm font-medium">
              Latitude
            </label>

            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
            />

            <label className="mt-4 block text-sm font-medium">
              Longitude
            </label>

            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
            />
          </>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          className="mt-5 w-full rounded-md bg-slate-900 px-4 py-2 text-white"
          type="submit"
        >
          Register
        </button>
      </form>
    </main>
  );
}