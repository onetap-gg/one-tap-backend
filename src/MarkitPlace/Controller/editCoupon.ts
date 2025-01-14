import { Controller } from "../../utils/interfaces/controller";
import { markitDao } from "../Dao/MarkitDao";

export const editCoupon: Controller = async (req, res) => {
  const coupon = req.body;
  const id = req.params.id
  try {
    const data = await markitDao.editCoupon(coupon, id as unknown as number);
    res.status(200).json(data);
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
