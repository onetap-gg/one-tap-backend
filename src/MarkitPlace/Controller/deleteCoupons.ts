import { Controller } from "../../utils/interfaces/controller";
import { markitDao } from "../Dao/MarkitDao";

export const deleteCoupon: Controller = async (req, res) => {
  const { couponId } = req.params;
  try {
    const data = await markitDao.deleteCoupon(couponId);
    res.status(200).json(data);
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
