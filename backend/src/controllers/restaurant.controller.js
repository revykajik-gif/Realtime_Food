import {
  createRestaurant,
  getRestaurantById,
  getRestaurants,getMyRestaurant
} from "../services/restaurant.service.js";

export const create = async (req, res, next) => {
  try {
    const restaurant = await createRestaurant(req.user.id, req.validated.body);
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const restaurants = await getRestaurants();
    res.json({ success: true, data: restaurants });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const restaurant = await getRestaurantById(req.params.id);
    res.json({ success: true, data: restaurant });
  } catch (error) {
    next(error);
  }
};
export const getMine = async (req, res, next) => {
  try {
    const restaurant = await getMyRestaurant(req.user.id);

    res.json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};