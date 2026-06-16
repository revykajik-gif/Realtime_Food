import { createFoodItem, updateFoodItem } from "../services/foodItem.service.js";

export const create = async (req, res, next) => {
  try {
    const foodItem = await createFoodItem(req.user.id, req.validated.body);
    res.status(201).json({ success: true, data: foodItem });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const foodItem = await updateFoodItem(req.user.id, req.validated.params.id, req.validated.body);
    res.json({ success: true, data: foodItem });
  } catch (error) {
    next(error);
  }
};
