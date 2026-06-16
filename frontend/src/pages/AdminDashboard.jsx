import { useEffect, useState } from "react";
import { api } from "../api/client";
import StatCard from "../components/StatCard.jsx";

export default function AdminDashboard() {
  const [overview, setOverview] = useState({ users: [], restaurants: [], riders: [], orders: [] });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/api/admin/overview")
      .then((response) => setOverview(response.data.data))
      .catch(() => setMessage("Could not load admin overview."));
  }, []);

  return (
    <section>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Users" value={overview.users.length} />
        <StatCard label="Restaurants" value={overview.restaurants.length} />
        <StatCard label="Riders" value={overview.riders.length} />
        <StatCard label="Orders" value={overview.orders.length} />
        <StatCard
          label="Delivered"
          value={overview.orders.filter((order) => order.status === "DELIVERED").length}
        />
      </div>

      {message && (
        <p className="mt-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          {message}
        </p>
      )}

      <div className="mt-8 grid gap-6">
        <DataTable
          columns={["Name", "Email", "Role"]}
          rows={overview.users.map((user) => [user.name, user.email, user.role])}
          title="Users"
        />
        <DataTable
          columns={["Restaurant", "Address"]}
          rows={overview.restaurants.map((restaurant) => [restaurant.name, restaurant.address])}
          title="Restaurants"
        />
        <DataTable
          columns={["Rider", "Available", "Location"]}
          rows={overview.riders.map((rider) => [
            rider.user?.name,
            rider.isAvailable ? "Yes" : "No",
            `${rider.latitude}, ${rider.longitude}`,
          ])}
          title="Riders"
        />
        <DataTable
          columns={["Order", "Customer", "Restaurant", "Status", "Total"]}
          rows={overview.orders.map((order) => [
            order.id.slice(0, 8),
            order.customer?.name,
            order.restaurant?.name,
            order.status,
            `Rs. ${order.totalAmount}`,
          ])}
          title="Orders"
        />
      </div>
    </section>
  );
}

function DataTable({ columns, rows, title }) {
  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h2 className="font-semibold">{title}</h2>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {columns.map((column) => (
              <th className="px-4 py-3" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr className="border-t border-slate-100" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td className="px-4 py-3" key={cellIndex}>
                  {cell || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
