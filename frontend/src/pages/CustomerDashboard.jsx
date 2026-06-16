import { socket } from "../api/socket";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import StatCard from "../components/StatCard.jsx";

const sortOrders = (orders) =>
  [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const upsertOrder = (orders, nextOrder) => {
  const exists = orders.some((order) => order.id === nextOrder.id);

  const nextOrders = exists
    ? orders.map((order) =>
        order.id === nextOrder.id
          ? nextOrder
          : order
      )
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

export default function CustomerDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  // const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [restaurantResponse, orderResponse] = await Promise.all([
      api.get("/api/restaurants"),
      api.get("/api/orders"),
    ]);

    setRestaurants(restaurantResponse.data.data);
    setOrders(sortOrders(orderResponse.data.data));
    // setSelectedRestaurantId((current) => current || restaurantResponse.data.data[0]?.id || "");
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

  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prev) =>
      upsertOrder(prev, updatedOrder)
    );
  };

  socket.on(
    "order-status-updated",
    handleOrderUpdate
  );

  return () => {
    socket.off(
      "order-status-updated",
      handleOrderUpdate
    );
  };
}, []);
  // const selectedRestaurant = restaurants.find((restaurant) => restaurant.id === selectedRestaurantId);


const updateQuantity = (foodItemId, quantity) => {
  setQuantities((current) => ({
    ...current,
    [foodItemId]:
      quantity === ""
        ? ""
        : Math.max(0, Number(quantity)),
  }));
};
// const placeOrder = async () => {
//   try {
//     if (!selectedRestaurant || selectedItems.length === 0) {
//       setMessage("Select at least one food item.");
//       return;
//     }

//     await api.post("/api/orders", {
//       restaurantId: selectedRestaurant.id,
//       items: selectedItems,
//     });

//     await loadData();

//     setQuantities({});
//     setMessage("Order placed successfully.");
//   } catch (error) {
//     setMessage(
//       error?.response?.data?.message ||
//       "Order could not be placed."
//     );
//   }
// };
const placeOrder = async (restaurant) => {
  try {
    const restaurantFoodIds =
      restaurant.foodItems.map(
        (item) => item.id
      );

    const items = Object.entries(
      quantities
    )
      .filter(
        ([foodItemId, quantity]) =>
          restaurantFoodIds.includes(
            foodItemId
          ) &&
          Number(quantity) > 0
      )
      .map(
        ([foodItemId, quantity]) => ({
          foodItemId,
          quantity: Number(quantity),
        })
      );

    if (items.length === 0) {
      setMessage(
        "Select at least one food item."
      );
      return;
    }

    await api.post("/api/orders", {
      restaurantId: restaurant.id,
      items,
    });

    await loadData();

    setMessage(
      "Order placed successfully."
    );
  } catch (error) {
    setMessage(
      error?.response?.data?.message ||
        "Order could not be placed."
    );
  }
};
  const cancelOrder = async (orderId) => {
    const response = await api.patch(`/api/orders/${orderId}/cancel`);
    setOrders((prev) => upsertOrder(prev, response.data.data));
    setMessage("Order cancelled.");
  };

  const showError = (error, fallback) => {
    setMessage(error?.response?.data?.message || fallback);
  };

  return (
    <section>
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Restaurants" value={restaurants.length} />
        <StatCard label="My Orders" value={orders.length} />
      </div>
<div className="mt-6 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white shadow-md">
  <h2 className="text-xl font-bold">
    Welcome Back 👋
  </h2>

  <p className="mt-1 text-indigo-100">
    Order from your favorite restaurants and
    track deliveries in real time.
  </p>
</div>
      {message && (
        <p className="mt-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          {message}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <div className="flex items-center justify-between gap-3">
            {/* <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              value={selectedRestaurantId}
              onChange={(event) => {
                setSelectedRestaurantId(event.target.value);
                setQuantities({});
              }}
            >
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select> */}
            <section>
  <h2 className="text-lg font-semibold">
    Available Restaurants
  </h2>

  <div className="mt-4 grid gap-6">
    {restaurants.map((restaurant) => (
      <article
        key={restaurant.id}
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h3 className="text-lg font-semibold">
          {restaurant.name}
        </h3>

        <p className="text-sm text-slate-500">
          {restaurant.address}
        </p>

        <div className="mt-4 divide-y divide-slate-100">
          {restaurant.foodItems?.map(
            (foodItem) => (
              <div
                key={foodItem.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium">
                    {foodItem.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {foodItem.description}
                  </p>

                  <p className="text-sm font-medium text-orange-600">
                    Rs. {foodItem.price}
                  </p>
                </div>
<input
  type="number"
  min="0"
  className="w-20 rounded-md border px-3 py-2"
  value={quantities[foodItem.id] ?? ""}
  onChange={(e) =>
    updateQuantity(
      foodItem.id,
      e.target.value
    )
  }
/>
              </div>
            )
          )}
        </div>

<button
  className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
  onClick={() => placeOrder(restaurant)}
>
  Order From This Restaurant
</button>
      </article>
    ))}
  </div>
</section>
          </div>

          {/* {selectedRestaurant && (
            <article className="mt-3 rounded-md border border-slate-200 bg-white p-4">
              <h3 className="font-medium">{selectedRestaurant.name}</h3>
              <p className="text-sm text-slate-500">{selectedRestaurant.address}</p>

              <div className="mt-4 divide-y divide-slate-100">
                {selectedRestaurant.foodItems?.map((foodItem) => (
                  <div className="flex items-center justify-between gap-4 py-3" key={foodItem.id}>
                    <div>
                      <p className="font-medium">{foodItem.name}</p>
                      <p className="text-sm text-slate-500">{foodItem.description}</p>
                      <p className="mt-1 text-sm">Rs. {foodItem.price}</p>
                    </div>
                    <input
                      className="h-10 w-20 rounded-md border border-slate-300 px-3 text-right"
                      min="0"
                      type="number"
                      value={quantities[foodItem.id] || 0}
                      onChange={(event) => updateQuantity(foodItem.id, event.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <p className="font-medium">Total: Rs. {total}</p>
                <button
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-400"
                  disabled={selectedItems.length === 0}
                  onClick={placeOrder}
                  type="button"
                >
                  Place Order
                </button>
              </div>
            </article>
          )} */}
        </section>

        <section>
          <h2 className="text-base font-semibold">My Orders</h2>
          <div className="mt-3 grid gap-3">
            {orders.map((order) => (
              <article className="rounded-md border border-slate-200 bg-white p-4" key={order.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{order.restaurant?.name}</h3>
                    <p className="text-sm text-slate-500">Order #{order.id.slice(0, 8)}</p>
<div className="mt-2">
  <span
    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
      statusColors[order.status]
    }`}
  >
    {order.status.replaceAll("_", " ")}
  </span>
</div>

<div className="mt-3 flex flex-wrap gap-2">
  {[
    "PLACED",
    "ACCEPTED",
    "RIDER_ASSIGNED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ].map((step) => (
    <span
      key={step}
      className={`rounded-full px-2 py-1 text-xs ${
        order.status === step
          ? "bg-green-600 text-white"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {step.replaceAll("_", " ")}
    </span>
  ))}
</div>
                    <p className="text-sm">Rs. {order.totalAmount}</p>
                  </div>
                  {order.status === "PLACED" && (
                    <button
                      className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                      onClick={() =>
                        cancelOrder(order.id).catch((error) =>
                          showError(error, "Order could not be cancelled.")
                        )
                      }
                      type="button"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
