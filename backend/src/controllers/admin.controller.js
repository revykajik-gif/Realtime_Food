import { getAdminOverview } from "../services/admin.service.js";

export const overview = async (req, res, next) => {
  try {
    const data = await getAdminOverview();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
