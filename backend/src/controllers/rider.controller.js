import { getRiderAssignments, updateRiderAvailability } from "../services/rider.service.js";
import prisma from "../config/db.js";
export const updateAvailability = async (req, res, next) => {
  try {
    const rider = await updateRiderAvailability(req.user.id, req.body);
    res.json({ success: true, data: rider });
  } catch (error) {
    next(error);
  }
};

export const assignments = async (req, res, next) => {
  try {
    const orders = await getRiderAssignments(req.user.id);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};
export const getMyProfile = async (req,res)=>{
 const rider = await prisma.riderProfile.findUnique({
   where:{ userId:req.user.id }
 });

 res.json({
   success:true,
   data:rider
 });
};