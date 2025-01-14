import { Controller } from "../../utils/interfaces/controller";

import { markitDao } from "../Dao/MarkitDao";

export const setCoupon: Controller = async (req, res) => {
  try {
    const coupon = req.body.coupon;
    console.log(coupon);
    const data = await markitDao.setCoupon(coupon);
    res.status(200).json(data);
  } catch (err: any) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
