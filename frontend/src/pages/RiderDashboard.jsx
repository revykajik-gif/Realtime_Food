// import { useEffect, useState } from "react";
// import { api } from "../api/client";
// import StatCard from "../components/StatCard.jsx";

// const sortOrders = (orders) =>
//   [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// const upsertOrder = (orders, nextOrder) => {
//   const exists = orders.some((order) => order.id === nextOrder.id);
//   const nextOrders = exists
//     ? orders.map((order) => (order.id === nextOrder.id ? nextOrder : order))
//     : [nextOrder, ...orders];

//   return sortOrders(nextOrders);
// };
// const statusColors = {
//   RIDER_ASSIGNED: "bg-blue-100 text-blue-800",
//   OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
//   DELIVERED: "bg-green-100 text-green-800",
// };
// export default function RiderDashboard() {
//   const [orders, setOrders] = useState([]);
//   const [isAvailable, setIsAvailable] = useState(true);
//   const [message, setMessage] = useState("");

//   const loadAssignments = async () => {
//     const response = await api.get("/api/riders/assignments");
//     setOrders(sortOrders(response.data.data));
//   };

//   const loadProfile = async () => {
//     const response = await api.get("/api/riders/me");

//     if (response.data.data) {
//       setIsAvailable(response.data.data.isAvailable);
//     }
//   };

// useEffect(() => {
//   loadAssignments();
//   loadProfile();

//   const interval = setInterval(() => {
//     loadAssignments();
//     loadProfile();
//   }, 5000);

//   return () => clearInterval(interval);
// }, []);
//   const updateAvailability = async (nextValue) => {
//     const response = await api.patch("/api/riders/availability", { isAvailable: nextValue });
//     setIsAvailable(response.data.data.isAvailable);
//     setMessage(nextValue ? "You are online for assignments." : "You are offline.");
//     await loadAssignments();
//   };

// const moveOrder = async (order) => {
//   try {
//     const endpoint =
//       order.status === "RIDER_ASSIGNED"
//         ? `/api/orders/${order.id}/out-for-delivery`
//         : `/api/orders/${order.id}/deliver`;

//     await api.patch(endpoint);

//     await loadAssignments();
//     await loadProfile();

//     setMessage("Order status updated.");
//   } catch (error) {
//     setMessage(
//       error?.response?.data?.message ||
//       "Order status could not be updated."
//     );
//   }
// };

//   return (
//     <section>
//       <div className="grid gap-4 md:grid-cols-2">
//         <StatCard label="Assigned Orders" value={orders.length} />
//         <StatCard label="Out For Delivery" value={orders.filter((order) => order.status === "OUT_FOR_DELIVERY").length} />
//       </div>

//       <div className="mt-4 flex items-center justify-between rounded-md border border-slate-200 bg-white p-4">
//         <div>
//           <h2 className="font-medium">Availability</h2>
//           <p className="text-sm text-slate-500">{isAvailable ? "Online" : "Offline"}</p>
//         </div>
//         <button
//           className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
//           onClick={() => updateAvailability(!isAvailable).catch(() => setMessage("Availability could not be updated."))}
//           type="button"
//         >
//           {isAvailable ? "Go Offline" : "Go Online"}
//         </button>
//       </div>

//       {message && (
//         <p className="mt-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
//           {message}
//         </p>
//       )}

//       <div className="mt-8 grid gap-3">
//         {orders.map((order) => (
//           <article className="rounded-md border border-slate-200 bg-white p-4" key={order.id}>
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <h2 className="font-medium">{order.restaurant?.name}</h2>
//                 <p className="text-sm text-slate-500">{order.restaurant?.address}</p>
//                 <span
//   className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
//     statusColors[order.status] ||
//     "bg-slate-100 text-slate-700"
//   }`}
// >
//   {order.status.replaceAll("_", " ")}
// </span>
//                 <div className="mt-3 space-y-1 text-sm">
//                   {order.orderItems?.map((item) => (
//                     <p key={item.id}>
//                       {item.quantity} x {item.foodItem?.name} - Rs. {item.price}
//                     </p>
//                   ))}
//                 </div>
//               </div>
//               {(order.status === "RIDER_ASSIGNED" || order.status === "OUT_FOR_DELIVERY") && (
//                 <button
//                   className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
//                   onClick={() => moveOrder(order).catch(() => setMessage("Order status could not be updated."))}
//                   type="button"
//                 >
//                   {order.status === "RIDER_ASSIGNED" ? "Out For Delivery" : "Mark Delivered"}
//                 </button>
//               )}
//             </div>
//           </article>
//         ))}

//         {orders.length === 0 && (
//           <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
//             No assigned deliveries yet.
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
import { useEffect, useState } from "react";
import { api } from "../api/client";
import StatCard from "../components/StatCard.jsx";
import { socket } from "../api/socket";
const sortOrders = (orders) =>
  [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const upsertOrder = (orders, nextOrder) => {
  const exists = orders.some((order) => order.id === nextOrder.id);
  const nextOrders = exists
    ? orders.map((order) => (order.id === nextOrder.id ? nextOrder : order))
    : [nextOrder, ...orders];

  return sortOrders(nextOrders);
};
const statusColors = {
  RIDER_ASSIGNED: "bg-blue-100 text-blue-800",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
};
export default function RiderDashboard() {
  const [orders, setOrders] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [message, setMessage] = useState("");

  const loadAssignments = async () => {
    const response = await api.get("/api/riders/assignments");
    setOrders(sortOrders(response.data.data));
  };

  const loadProfile = async () => {
    const response = await api.get("/api/riders/me");

    if (response.data.data) {
      setIsAvailable(response.data.data.isAvailable);
    }
  };
useEffect(() => {
  loadAssignments();
  loadProfile();

  const handleAssignment = (order) => {
    setOrders((prev) =>
      upsertOrder(prev, order)
    );

    setIsAvailable(false);

    setMessage(
      "New delivery assigned."
    );
  };

  const handleOrderUpdate = (
    updatedOrder
  ) => {
    setOrders((prev) =>
      upsertOrder(
        prev,
        updatedOrder
      )
    );

    if (
      updatedOrder.status ===
      "DELIVERED"
    ) {
      loadProfile();
    }
  };

  socket.on(
    "new-assignment",
    handleAssignment
  );

  socket.on(
    "order-status-updated",
    handleOrderUpdate
  );

  return () => {
    socket.off(
      "new-assignment",
      handleAssignment
    );

    socket.off(
      "order-status-updated",
      handleOrderUpdate
    );
  };
}, []);
  // const updateAvailability = async (nextValue) => {
  //   const response = await api.patch("/api/riders/availability", { isAvailable: nextValue });
  //   setIsAvailable(response.data.data.isAvailable);
  //   setMessage(nextValue ? "You are online for assignments." : "You are offline.");
  //   await loadAssignments();
  // };
const updateAvailability = async (
  nextValue
) => {
  const response =
    await api.patch(
      "/api/riders/availability",
      {
        isAvailable: nextValue,
      }
    );

  setIsAvailable(
    response.data.data.isAvailable
  );

  setMessage(
    nextValue
      ? "You are online for assignments."
      : "You are offline."
  );

  await loadAssignments();
};
const moveOrder = async (order) => {
  try {
    const endpoint =
      order.status === "RIDER_ASSIGNED"
        ? `/api/orders/${order.id}/out-for-delivery`
        : `/api/orders/${order.id}/deliver`;

    await api.patch(endpoint);

    setMessage("Order status updated.");
  } catch (error) {
    setMessage(
      error?.response?.data?.message ||
      "Order status could not be updated."
    );
  }
};

  return (
    <section>
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Assigned Orders" value={orders.length} />
        <StatCard label="Out For Delivery" value={orders.filter((order) => order.status === "OUT_FOR_DELIVERY").length} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-md border border-slate-200 bg-white p-4">
        <div>
          <h2 className="font-medium">Availability</h2>
          <p className="text-sm text-slate-500">{isAvailable ? "Online" : "Offline"}</p>
        </div>
        <button
          className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          onClick={() => updateAvailability(!isAvailable).catch(() => setMessage("Availability could not be updated."))}
          type="button"
        >
          {isAvailable ? "Go Offline" : "Go Online"}
        </button>
      </div>
<div className="mt-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white shadow-md">
  <h2 className="text-xl font-bold">
    Rider Dashboard 🛵
  </h2>

  <p className="mt-1 text-orange-100">
    Manage deliveries and update order status.
  </p>
</div>
      {message && (
        <p className="mt-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          {message}
        </p>
      )}

      <div className="mt-8 grid gap-3">
        {orders.map((order) => (
          <article className="rounded-md border border-slate-200 bg-white p-4" key={order.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-medium">{order.restaurant?.name}</h2>
                <p className="text-sm text-slate-500">{order.restaurant?.address}</p>
                <span
  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
    statusColors[order.status] ||
    "bg-slate-100 text-slate-700"
  }`}
>
  {order.status.replaceAll("_", " ")}
</span>
                <div className="mt-3 space-y-1 text-sm">
                  {order.orderItems?.map((item) => (
                    <p key={item.id}>
                      {item.quantity} x {item.foodItem?.name} - Rs. {item.price}
                    </p>
                  ))}
                </div>
              </div>
              {(order.status === "RIDER_ASSIGNED" || order.status === "OUT_FOR_DELIVERY") && (
                <button
                  className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
                  onClick={() => moveOrder(order).catch(() => setMessage("Order status could not be updated."))}
                  type="button"
                >
                  {order.status === "RIDER_ASSIGNED" ? "Out For Delivery" : "Mark Delivered"}
                </button>
              )}
            </div>
          </article>
        ))}

        {orders.length === 0 && (
          <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No assigned deliveries yet.
          </div>
        )}
      </div>
    </section>
  );
}
