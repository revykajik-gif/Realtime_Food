// import {
//   acceptOrderAndAssignRider,
//   cancelOrder,
//   createOrder,
//   getOrdersForUser,
//   markOrderDelivered,
//   markOrderOutForDelivery,
//   rejectOrderByRestaurant,
// } from "../services/order.service.js";

// export const create = async (req, res, next) => {
//   try {
//     const order = await createOrder(req.user.id, req.validated.body);
//     res.status(201).json({ success: true, data: order });
//   } catch (error) {
//     next(error);
//   }
// };

// export const listMine = async (req, res, next) => {
//   try {
//     const orders = await getOrdersForUser(req.user);
//     res.json({ success: true, data: orders });
//   } catch (error) {
//     next(error);
//   }
// };

// export const cancel = async (req, res, next) => {
//   try {
//     const order = await cancelOrder(req.user.id, req.validated.params.id);
//     res.json({ success: true, data: order });
//   } catch (error) {
//     next(error);
//   }
// };

// export const accept = async (req, res, next) => {
//   try {
//     const order = await acceptOrderAndAssignRider(req.user.id, req.validated.params.id);
//     res.json({ success: true, data: order });
//   } catch (error) {
//     next(error);
//   }
// };

// export const reject = async (req, res, next) => {
//   try {
//     const order = await rejectOrderByRestaurant(req.user.id, req.validated.params.id);
//     res.json({ success: true, data: order });
//   } catch (error) {
//     next(error);
//   }
// };

// export const outForDelivery = async (req, res, next) => {
//   try {
//     const order = await markOrderOutForDelivery(req.user.id, req.validated.params.id);
//     res.json({ success: true, data: order });
//   } catch (error) {
//     next(error);
//   }
// };

// export const delivered = async (req, res, next) => {
//   try {
//     const order = await markOrderDelivered(req.user.id, req.validated.params.id);
//     res.json({ success: true, data: order });
//   } catch (error) {
//     next(error);
//   }
// };
import {
  acceptOrderAndAssignRider,
  cancelOrder,
  createOrder,
  getOrdersForUser,
  markOrderDelivered,
  markOrderOutForDelivery,
  rejectOrderByRestaurant,
} from "../services/order.service.js";

export const create = async (req, res, next) => {
  try {
    // req.user.id provides the authenticated Customer ID
    const order = await createOrder(req.user.id, req.validated.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const listMine = async (req, res, next) => {
  try {
    // Passes the user context object down to filter orders cleanly
    const orders = await getOrdersForUser(req.user);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const order = await cancelOrder(req.user.id, (req.validated.params.id));
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const accept = async (req, res, next) => {
  try {
    // Handles the restaurant acceptance and automatically triggers the isolated rider lookup thread
    const order = await acceptOrderAndAssignRider(req.user.id, (req.validated.params.id));
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const reject = async (req, res, next) => {
  try {
    const order = await rejectOrderByRestaurant(req.user.id, (req.validated.params.id));
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const outForDelivery = async (req, res, next) => {
  try {
    // Validates that the rider moving the state is the actual rider assigned
    const order = await markOrderOutForDelivery(req.user.id, (req.validated.params.id));
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const delivered = async (req, res, next) => {
  try {
    // Updates order to DELIVERED and safely flips the rider back to available in a single transaction
    const order = await markOrderDelivered(req.user.id, (req.validated.params.id));
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};