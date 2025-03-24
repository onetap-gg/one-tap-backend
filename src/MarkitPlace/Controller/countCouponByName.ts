import { Controller } from "../../utils/interfaces/controller";
import { markitDao } from "../Dao/MarkitDao";

export const countCouponByName: Controller = async (req, res) => {
  try {
    const data = await markitDao.couponCountByGame();
    res.status(200).json(data);
  } catch (err: any) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
