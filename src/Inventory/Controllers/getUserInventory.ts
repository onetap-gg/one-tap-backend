import { Controller } from "../../utils/interfaces/controller";
import { inventoryDao } from "../Dao/InventoryDao";

/**
 * Gets all items in a user's inventory (from UserPurchases table)
 * This includes all items the user has purchased/acquired
 */
export const getUserInventory: Controller = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    const inventoryItems = await inventoryDao.getPurchaseHistory(userId);

    res.status(200).json({
      inventory: inventoryItems || [],
    });
  } catch (error) {
    console.error("Error in getUserInventory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
