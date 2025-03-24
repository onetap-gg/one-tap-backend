import { Controller } from "../../utils/interfaces/controller";
import { inventoryDao } from "../../Inventory/Dao/InventoryDao";
import { markitDao } from "../Dao/MarkitDao";

export const redeemCoupons: Controller = async (req, res) => {
  try {
    const couponId = req.body.couponId;
    const userId = req.body.userId;
    const coupon = await markitDao.getCouponById(couponId);
    const redeem = await inventoryDao.addToInventory(
      { itemId: couponId, amount: coupon.points_to_redeem },
      userId
    );
    console.log(redeem);
    const data = await markitDao.deleteCoupon(couponId);
    console.log(data);
    res.status(200).json(redeem);
  } catch (err: any) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
