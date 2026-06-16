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
//   PLACED: "bg-yellow-100 text-yellow-800",
//   ACCEPTED: "bg-blue-100 text-blue-800",
//   SEARCHING_RIDER: "bg-purple-100 text-purple-800",
//   RIDER_ASSIGNED: "bg-indigo-100 text-indigo-800",
//   OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
//   DELIVERED: "bg-green-100 text-green-800",
//   CANCELLED: "bg-red-100 text-red-800",
// };
// export default function RestaurantDashboard() {
//   const [orders, setOrders] = useState([]);
//   const [myRestaurant, setMyRestaurant] = useState(null);

//   const [foodItem, setFoodItem] = useState({
//     name: "",
//     description: "",
//     price: "",
//   });

//   const [message, setMessage] = useState("");

//   const [restaurantForm, setRestaurantForm] = useState({
//     name: "",
//     address: "",
//     latitude: "",
//     longitude: "",
//   });

//   const loadData = async () => {
//     const [orderResponse, restaurantResponse] = await Promise.all([
//       api.get("/api/orders"),
//       api.get("/api/restaurants/mine"),
//     ]);

//     setOrders(sortOrders(orderResponse.data.data));
//     setMyRestaurant(restaurantResponse.data.data);


//   };

// useEffect(() => {
//   loadData();

//   const interval = setInterval(() => {
//     loadData();
//   }, 5000);

//   return () => clearInterval(interval);
// }, []);
//   const createRestaurant = async (event) => {
//     event.preventDefault();

//     const response = await api.post("/api/restaurants", {
//       name: restaurantForm.name,
//       address: restaurantForm.address,
//       latitude: Number(restaurantForm.latitude),
//       longitude: Number(restaurantForm.longitude),
//     });

//     setRestaurantForm({
//       name: "",
//       address: "",
//       latitude: "",
//       longitude: "",
//     });

//     setMessage("Restaurant created.");

//     await loadData();
//   };

// const acceptOrder = async (orderId) => {
//   try {
//     await api.patch(`/api/orders/${orderId}/accept`);

//     await loadData();

//     setMessage("Order accepted.");
//   } catch (error) {
//     setMessage(
//       error?.response?.data?.message ||
//       "Order could not be accepted."
//     );
//   }
// };
// const rejectOrder = async (orderId) => {
//   try {
//     await api.patch(`/api/orders/${orderId}/reject`);

//     await loadData();

//     setMessage("Order rejected.");
//   } catch (error) {
//     setMessage(
//       error?.response?.data?.message ||
//       "Order could not be rejected."
//     );
//   }
// };

//   const showError = (error, fallback) => {
//     setMessage(error?.response?.data?.message || fallback);
//   };

//   const createFoodItem = async (event) => {
//     event.preventDefault();

//     await api.post("/api/food-items", {
//       restaurantId: myRestaurant.id,
//       name: foodItem.name,
//       description: foodItem.description,
//       price: Number(foodItem.price),
//     });

//     setFoodItem({
//       name: "",
//       description: "",
//       price: "",
//     });

//     setMessage("Food item added.");

//     await loadData();
//   };

//   return (
//     <section>
//       <div className="grid gap-4 md:grid-cols-3">
//         <StatCard
//           label="Incoming Orders"
//           value={orders.filter((order) => order.status === "PLACED").length}
//         />

//         <StatCard
//           label="Active Orders"
//           value={
//             orders.filter((order) => order.status !== "DELIVERED").length
//           }
//         />

//         <StatCard
//           label="Completed"
//           value={
//             orders.filter((order) => order.status === "DELIVERED").length
//           }
//         />
//       </div>

//       {message && (
//         <p className="mt-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
//           {message}
//         </p>
//       )}

//       <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
//         <OrderTable
//           orders={orders}
//           onAccept={acceptOrder}
//           onReject={rejectOrder}
//           onError={showError}
//         />

//         {!myRestaurant ? (
//           <section className="rounded-md border border-slate-200 bg-white p-4">
//             <h2 className="text-base font-semibold">
//               Create Restaurant
//             </h2>

//             <p className="mt-1 text-sm text-slate-500">
//               Create your restaurant before adding food items.
//             </p>

//             <form
//               className="mt-4 grid gap-3"
//               onSubmit={(event) =>
//                 createRestaurant(event).catch(() =>
//                   setMessage("Restaurant could not be created.")
//                 )
//               }
//             >
//               <input
//                 className="rounded-md border border-slate-300 px-3 py-2"
//                 placeholder="Restaurant Name"
//                 value={restaurantForm.name}
//                 onChange={(event) =>
//                   setRestaurantForm((current) => ({
//                     ...current,
//                     name: event.target.value,
//                   }))
//                 }
//               />

//               <input
//                 className="rounded-md border border-slate-300 px-3 py-2"
//                 placeholder="Address"
//                 value={restaurantForm.address}
//                 onChange={(event) =>
//                   setRestaurantForm((current) => ({
//                     ...current,
//                     address: event.target.value,
//                   }))
//                 }
//               />

//               <input
//                 className="rounded-md border border-slate-300 px-3 py-2"
//                 placeholder="Latitude"
//                 value={restaurantForm.latitude}
//                 onChange={(event) =>
//                   setRestaurantForm((current) => ({
//                     ...current,
//                     latitude: event.target.value,
//                   }))
//                 }
//               />

//               <input
//                 className="rounded-md border border-slate-300 px-3 py-2"
//                 placeholder="Longitude"
//                 value={restaurantForm.longitude}
//                 onChange={(event) =>
//                   setRestaurantForm((current) => ({
//                     ...current,
//                     longitude: event.target.value,
//                   }))
//                 }
//               />

//               <button
//                 className="rounded-md bg-slate-900 px-4 py-2 text-white"
//                 type="submit"
//               >
//                 Create Restaurant
//               </button>
//             </form>
//           </section>
//         ) : (
//           <section className="rounded-md border border-slate-200 bg-white p-4">
//             <h2 className="text-base font-semibold">
//               Food Items
//             </h2>

//             <p className="mt-1 text-sm text-slate-500">
//               Restaurant: {myRestaurant.name}
//             </p>

//             <form
//               className="mt-4 grid gap-3"
//               onSubmit={(event) =>
//                 createFoodItem(event).catch(() =>
//                   setMessage("Food item could not be added.")
//                 )
//               }
//             >
//               <input
//                 className="rounded-md border border-slate-300 px-3 py-2"
//                 placeholder="Item name"
//                 value={foodItem.name}
//                 onChange={(event) =>
//                   setFoodItem((current) => ({
//                     ...current,
//                     name: event.target.value,
//                   }))
//                 }
//               />

//               <input
//                 className="rounded-md border border-slate-300 px-3 py-2"
//                 placeholder="Description"
//                 value={foodItem.description}
//                 onChange={(event) =>
//                   setFoodItem((current) => ({
//                     ...current,
//                     description: event.target.value,
//                   }))
//                 }
//               />

//               <input
//                 className="rounded-md border border-slate-300 px-3 py-2"
//                 type="number"
//                 min="1"
//                 placeholder="Price"
//                 value={foodItem.price}
//                 onChange={(event) =>
//                   setFoodItem((current) => ({
//                     ...current,
//                     price: event.target.value,
//                   }))
//                 }
//               />

//               <button
//                 className="rounded-md bg-slate-900 px-4 py-2 text-white"
//                 type="submit"
//               >
//                 Add Food Item
//               </button>
//             </form>

//             {myRestaurant.foodItems?.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="font-medium">
//                   Existing Food Items
//                 </h3>

//                 <div className="mt-3 space-y-2">
//                   {myRestaurant.foodItems.map((item) => (
//                     <div
//                       key={item.id}
//                       className="rounded border border-slate-200 p-3"
//                     >
//                       <div className="font-medium">{item.name}</div>

//                       <div className="text-sm text-slate-500">
//                         {item.description}
//                       </div>

//                       <div className="mt-1 text-sm">Rs. {item.price}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </section>
//         )}
//       </div>
//     </section>
//   );
// }

// function OrderTable({ orders, onAccept, onReject, onError }) {
//   return (
//     <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
//       <table className="w-full text-left text-sm">
//         <thead className="bg-slate-50 text-slate-500">
//           <tr>
//             <th className="px-4 py-3">Order</th>
//             <th className="px-4 py-3">Customer</th>
//             <th className="px-4 py-3">Status</th>
//             <th className="px-4 py-3">Total</th>
//             <th className="px-4 py-3">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {orders.length === 0 && (
//             <tr>
//               <td className="px-4 py-6 text-center text-slate-500" colSpan="5">
//                 No orders yet.
//               </td>
//             </tr>
//           )}

//           {orders.map((order) => (
//             <tr key={order.id} className="border-t border-slate-100">
//               <td className="px-4 py-3">{order.id.slice(0, 8)}</td>
//               <td className="px-4 py-3">{order.customer?.name}</td>
//               <td className="px-4 py-3">
//   <span
//     className={`rounded-full px-3 py-1 text-xs font-medium ${
//       statusColors[order.status]
//     }`}
//   >
//     {order.status.replaceAll("_", " ")}
//   </span>
// </td>
//               <td className="px-4 py-3">Rs. {order.totalAmount}</td>

//               <td className="px-4 py-3">
//                 {order.status === "PLACED" ? (
//                   <div className="flex flex-wrap gap-2">
//                     <button
//                       className="rounded-md bg-slate-900 px-3 py-2 text-xs text-white"
//                       onClick={() =>
//                         onAccept(order.id).catch((error) =>
//                           onError(error, "Order could not be accepted.")
//                         )
//                       }
//                       type="button"
//                     >
//                       Accept
//                     </button>
//                     <button
//                       className="rounded-md border border-red-300 px-3 py-2 text-xs text-red-700 hover:bg-red-50"
//                       onClick={() =>
//                         onReject(order.id).catch((error) =>
//                           onError(error, "Order could not be rejected.")
//                         )
//                       }
//                       type="button"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 ) : order.status === "SEARCHING_RIDER" ? (
//                   <div className="flex flex-wrap gap-2">
//                     <button
//                       className="rounded-md bg-slate-900 px-3 py-2 text-xs text-white"
//                       onClick={() =>
//                         onAccept(order.id).catch((error) =>
//                           onError(error, "Rider assignment could not be retried.")
//                         )
//                       }
//                       type="button"
//                     >
//                       Retry Assign
//                     </button>
//                     <button
//                       className="rounded-md border border-red-300 px-3 py-2 text-xs text-red-700 hover:bg-red-50"
//                       onClick={() =>
//                         onReject(order.id).catch((error) =>
//                           onError(error, "Order could not be rejected.")
//                         )
//                       }
//                       type="button"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 ) : (
//                   <span className="text-slate-400">
//                     No action
//                   </span>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
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
  PLACED: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  SEARCHING_RIDER: "bg-purple-100 text-purple-800",
  RIDER_ASSIGNED: "bg-indigo-100 text-indigo-800",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};
export default function RestaurantDashboard() {
  const [orders, setOrders] = useState([]);
  const [myRestaurant, setMyRestaurant] = useState(null);

  const [foodItem, setFoodItem] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [message, setMessage] = useState("");

  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const loadData = async () => {
    const [orderResponse, restaurantResponse] = await Promise.all([
      api.get("/api/orders"),
      api.get("/api/restaurants/mine"),
    ]);

    setOrders(sortOrders(orderResponse.data.data));
    setMyRestaurant(restaurantResponse.data.data);


  };

// useEffect(() => {
//   loadData();

//   const interval = setInterval(() => {
//     loadData();
//   }, 5000);

//   return () => clearInterval(interval);
// }, []);
useEffect(() => {
  loadData();

  const handleNewOrder = (order) => {
    setOrders((prev) =>
      upsertOrder(prev, order)
    );

    setMessage(
      `New order received from ${order.customer?.name}`
    );
  };

  const handleOrderUpdate = (order) => {
    setOrders((prev) =>
      upsertOrder(prev, order)
    );
  };

  socket.on(
    "new-order",
    handleNewOrder
  );

  socket.on(
    "order-status-updated",
    handleOrderUpdate
  );

  return () => {
    socket.off(
      "new-order",
      handleNewOrder
    );

    socket.off(
      "order-status-updated",
      handleOrderUpdate
    );
  };
}, []);
  const createRestaurant = async (event) => {
    event.preventDefault();

    const response = await api.post("/api/restaurants", {
      name: restaurantForm.name,
      address: restaurantForm.address,
      latitude: Number(restaurantForm.latitude),
      longitude: Number(restaurantForm.longitude),
    });

    setRestaurantForm({
      name: "",
      address: "",
      latitude: "",
      longitude: "",
    });

    setMessage("Restaurant created.");

    await loadData();
  };

const acceptOrder = async (orderId) => {
  try {
    await api.patch(`/api/orders/${orderId}/accept`);


    setMessage("Order accepted.");
  } catch (error) {
    setMessage(
      error?.response?.data?.message ||
      "Order could not be accepted."
    );
  }
};
const rejectOrder = async (orderId) => {
  try {
    await api.patch(`/api/orders/${orderId}/reject`);


    setMessage("Order rejected.");
  } catch (error) {
    setMessage(
      error?.response?.data?.message ||
      "Order could not be rejected."
    );
  }
};

  const showError = (error, fallback) => {
    setMessage(error?.response?.data?.message || fallback);
  };

  const createFoodItem = async (event) => {
    event.preventDefault();

    await api.post("/api/food-items", {
      restaurantId: myRestaurant.id,
      name: foodItem.name,
      description: foodItem.description,
      price: Number(foodItem.price),
    });

    setFoodItem({
      name: "",
      description: "",
      price: "",
    });

    setMessage("Food item added.");

    await loadData();
  };

  return (
    <section>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Incoming Orders"
          value={orders.filter((order) => order.status === "PLACED").length}
        />

        <StatCard
          label="Active Orders"
          value={
            orders.filter((order) => order.status !== "DELIVERED").length
          }
        />

        <StatCard
          label="Completed"
          value={
            orders.filter((order) => order.status === "DELIVERED").length
          }
        />
      </div>
<div className="mt-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white shadow-md">
  <h2 className="text-xl font-bold">
    Restaurant Dashboard 🍽️
  </h2>

  <p className="mt-1 text-green-100">
    Manage incoming orders and food items.
  </p>
</div>
      {message && (
        <p className="mt-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          {message}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <OrderTable
          orders={orders}
          onAccept={acceptOrder}
          onReject={rejectOrder}
          onError={showError}
        />

        {!myRestaurant ? (
          <section className="rounded-md border border-slate-200 bg-white p-4">
            <h2 className="text-base font-semibold">
              Create Restaurant
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create your restaurant before adding food items.
            </p>

            <form
              className="mt-4 grid gap-3"
              onSubmit={(event) =>
                createRestaurant(event).catch(() =>
                  setMessage("Restaurant could not be created.")
                )
              }
            >
              <input
                className="rounded-md border border-slate-300 px-3 py-2"
                placeholder="Restaurant Name"
                value={restaurantForm.name}
                onChange={(event) =>
                  setRestaurantForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />

              <input
                className="rounded-md border border-slate-300 px-3 py-2"
                placeholder="Address"
                value={restaurantForm.address}
                onChange={(event) =>
                  setRestaurantForm((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
              />

              <input
                className="rounded-md border border-slate-300 px-3 py-2"
                placeholder="Latitude"
                value={restaurantForm.latitude}
                onChange={(event) =>
                  setRestaurantForm((current) => ({
                    ...current,
                    latitude: event.target.value,
                  }))
                }
              />

              <input
                className="rounded-md border border-slate-300 px-3 py-2"
                placeholder="Longitude"
                value={restaurantForm.longitude}
                onChange={(event) =>
                  setRestaurantForm((current) => ({
                    ...current,
                    longitude: event.target.value,
                  }))
                }
              />

              <button
                className="rounded-md bg-slate-900 px-4 py-2 text-white"
                type="submit"
              >
                Create Restaurant
              </button>
            </form>
          </section>
        ) : (
          <section className="rounded-md border border-slate-200 bg-white p-4">
            <h2 className="text-base font-semibold">
              Food Items
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Restaurant: {myRestaurant.name}
            </p>

            <form
              className="mt-4 grid gap-3"
              onSubmit={(event) =>
                createFoodItem(event).catch(() =>
                  setMessage("Food item could not be added.")
                )
              }
            >
              <input
                className="rounded-md border border-slate-300 px-3 py-2"
                placeholder="Item name"
                value={foodItem.name}
                onChange={(event) =>
                  setFoodItem((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />

              <input
                className="rounded-md border border-slate-300 px-3 py-2"
                placeholder="Description"
                value={foodItem.description}
                onChange={(event) =>
                  setFoodItem((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />

              <input
                className="rounded-md border border-slate-300 px-3 py-2"
                type="number"
                min="1"
                placeholder="Price"
                value={foodItem.price}
                onChange={(event) =>
                  setFoodItem((current) => ({
                    ...current,
                    price: event.target.value,
                  }))
                }
              />

              <button
                className="rounded-md bg-slate-900 px-4 py-2 text-white"
                type="submit"
              >
                Add Food Item
              </button>
            </form>

            {myRestaurant.foodItems?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium">
                  Existing Food Items
                </h3>

                <div className="mt-3 space-y-2">
                  {myRestaurant.foodItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded border border-slate-200 p-3"
                    >
                      <div className="font-medium">{item.name}</div>

                      <div className="text-sm text-slate-500">
                        {item.description}
                      </div>

                      <div className="mt-1 text-sm">Rs. {item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </section>
  );
}

function OrderTable({ orders, onAccept, onReject, onError }) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-slate-500" colSpan="5">
                No orders yet.
              </td>
            </tr>
          )}

          {orders.map((order) => (
            <tr key={order.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{order.id.slice(0, 8)}</td>
              <td className="px-4 py-3">{order.customer?.name}</td>
              <td className="px-4 py-3">
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      statusColors[order.status]
    }`}
  >
    {order.status.replaceAll("_", " ")}
  </span>
</td>
              <td className="px-4 py-3">Rs. {order.totalAmount}</td>

              <td className="px-4 py-3">
                {order.status === "PLACED" ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-md bg-slate-900 px-3 py-2 text-xs text-white"
                      onClick={() =>
                        onAccept(order.id).catch((error) =>
                          onError(error, "Order could not be accepted.")
                        )
                      }
                      type="button"
                    >
                      Accept
                    </button>
                    <button
                      className="rounded-md border border-red-300 px-3 py-2 text-xs text-red-700 hover:bg-red-50"
                      onClick={() =>
                        onReject(order.id).catch((error) =>
                          onError(error, "Order could not be rejected.")
                        )
                      }
                      type="button"
                    >
                      Reject
                    </button>
                  </div>
                ) : order.status === "SEARCHING_RIDER" ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-md bg-slate-900 px-3 py-2 text-xs text-white"
                      onClick={() =>
                        onAccept(order.id).catch((error) =>
                          onError(error, "Rider assignment could not be retried.")
                        )
                      }
                      type="button"
                    >
                      Retry Assign
                    </button>
                    <button
                      className="rounded-md border border-red-300 px-3 py-2 text-xs text-red-700 hover:bg-red-50"
                      onClick={() =>
                        onReject(order.id).catch((error) =>
                          onError(error, "Order could not be rejected.")
                        )
                      }
                      type="button"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-slate-400">
                    No action
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
