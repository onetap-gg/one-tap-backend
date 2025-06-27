import { Controller } from "../../utils/interfaces/controller";
import { markitDao } from "../Dao/MarkitDao";
import { itemDao } from "../Dao/ItemDao";

export const deleteCoupon: Controller = async (req, res) => {
  const { couponId } = req.params;
  try {
    // First get the coupon to check if it exists and get its item_id
    const coupon = await markitDao.getCouponById(couponId);
    if (!coupon || coupon.length === 0) {
      res.status(404).json({ message: "Coupon not found" });
      return;
    }

    const itemId = coupon[0].item_id;

    // Check if this is the last instance of this coupon
    const remainingCoupons = await markitDao.getCoupons();
    const isLastInstance = !remainingCoupons.some(
      (c: any) => c.item_id === itemId && c.id !== parseInt(couponId)
    );

    // Delete from marketplace
    const marketplaceData = await markitDao.deleteCoupon(couponId);

    // If this was the last instance, delete the item template
    if (isLastInstance) {
      await itemDao.deleteItem(itemId.toString());
    }

    res.status(200).json({
      message: "Coupon deleted successfully",
      marketplaceData,
      itemDeleted: isLastInstance,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
