export const initializeSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-customer", (customerId) => {
      socket.join(`customer:${customerId}`);
    });

    socket.on("join-restaurant", (restaurantId) => {
      socket.join(`restaurant:${restaurantId}`);
    });

    socket.on("join-rider", (riderId) => {
      socket.join(`rider:${riderId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};