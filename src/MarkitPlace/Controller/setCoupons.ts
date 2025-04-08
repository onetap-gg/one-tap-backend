import { Controller } from "../../utils/interfaces/controller";
import { markitDao } from "../Dao/MarkitDao";
import { itemDao } from "../Dao/ItemDao";

export const setCoupon: Controller = async (req, res) => {
  try {
    const coupon = req.body;
    const numberOfInstances = coupon.number_of_instances || 1; // Default to 1 if not specified
    console.log(coupon);

    // First add to Item table as template
    const itemData = await itemDao.setItem({
      itemName: coupon.coupon_name,
      itemType: "COUPON",
      itemValue: null,
      extraDetails: JSON.stringify({
        description: coupon.description,
        points_to_redeem: coupon.points_to_redeem,
      }),
      itemImage: null,
      gameId: coupon.game_id,
    });

    // Then add multiple instances to marketplace
    const marketplacePromises = Array(numberOfInstances)
      .fill(null)
      .map(() =>
        markitDao.setCoupon({
          coupon_name: coupon.coupon_name,
          game_id: coupon.game_id,
          description: coupon.description,
          points_to_redeem: coupon.points_to_redeem,
          item_id: itemData[0].id,
          is_available: true,
        })
      );

    const marketplaceData = await Promise.all(marketplacePromises);

    res.status(200).json({
      marketplaceData: marketplaceData.flat(), // Flatten because each setCoupon returns an array
      itemData,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
