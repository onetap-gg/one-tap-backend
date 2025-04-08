import { Controller } from "../../utils/interfaces/controller";
import { markitDao } from "../Dao/MarkitDao";
import { itemDao } from "../Dao/ItemDao";

export const editCoupon: Controller = async (req, res) => {
  const coupon = req.body;
  const id = req.params.id;
  try {
    // First verify the coupon exists
    const existingCoupon = await markitDao.getCouponById(id);
    if (!existingCoupon || existingCoupon.length === 0) {
      res.status(404).json({ message: "Coupon not found" });
      return;
    }

    // Verify the item exists
    const existingItem = await itemDao.getItemById(
      existingCoupon[0].item_id.toString()
    );
    if (!existingItem || existingItem.length === 0) {
      res.status(404).json({ message: "Associated item not found" });
      return;
    }

    // Update both tables
    const [marketplaceData, itemData] = await Promise.all([
      markitDao.editCoupon(coupon, id as unknown as number),
      itemDao.editItem(
        {
          id: existingCoupon[0].item_id,
          itemName: coupon.coupon_name,
          itemType: "COUPON",
          itemValue: null,
          extraDetails: JSON.stringify({
            description: coupon.description,
            points_to_redeem: coupon.points_to_redeem,
          }),
          itemImage: null,
          gameId: coupon.game_id,
        },
        existingCoupon[0].item_id
      ),
    ]);

    res.status(200).json({
      message: "Coupon updated successfully",
      marketplaceData,
      itemData,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
