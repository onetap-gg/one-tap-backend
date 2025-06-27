import { Controller } from "../../utils/interfaces/controller";
import { inventoryDao } from "../../Inventory/Dao/InventoryDao";
import { markitDao } from "../Dao/MarkitDao";
import { userDao } from "../../User/Dao/userDao";
import { transactionDao } from "../../Inventory/Dao/TransactionDao";

export const redeemCoupons: Controller = async (req, res): Promise<void> => {
  try {
    const itemId = req.body.itemId; // Changed from couponId to itemId
    const userId = req.body.userId.toString();

    // Get first available instance of this coupon
    const coupon = await markitDao.getFirstAvailableInstance(itemId);
    if (!coupon) {
      res
        .status(404)
        .json({ message: "No available instances of this coupon" });
      return;
    }

    // Get user's current balance
    const userData = await userDao.getUserBasicInfoById(userId);
    if (!userData) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if user has enough balance
    if (userData.balance < coupon.points_to_redeem) {
      res.status(400).json({ message: "Insufficient balance" });
      return;
    }

    // 1. Update user's balance
    await userDao.updateBalance(
      userId,
      userData.balance - coupon.points_to_redeem
    );

    // 2. Mark coupon instance as unavailable
    await markitDao.editCoupon({ ...coupon, is_available: false }, coupon.id);

    // 3. Add to UserPurchases table with marketplace_coupon_id
    const purchaseData = await inventoryDao.addToInventory(
      {
        itemId: coupon.item_id,
        amount: coupon.points_to_redeem,
        marketplace_coupon_id: coupon.id,
      },
      userId
    );

    // 4. Record the transaction
    await transactionDao.recordTransaction({
      userId,
      amount: coupon.points_to_redeem,
      type: "SPEND",
      source: "COUPON",
      sourceId: coupon.id.toString(),
    });

    res.status(200).json({
      message: "Coupon redeemed successfully",
      purchase: purchaseData,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err.message || "Server Error" });
  }
};
