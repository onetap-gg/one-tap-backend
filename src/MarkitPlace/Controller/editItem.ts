import { Controller } from "../../utils/interfaces/controller";
import { itemDao } from "../Dao/ItemDao";

export const editItem: Controller = async (req, res) => {
  const item = req.body;
  const id = req.params.id;
  try {
    // First verify the item exists
    const existingItem = await itemDao.getItemById(id);
    if (!existingItem || existingItem.length === 0) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    const itemData = await itemDao.editItem(item, parseInt(id));
    res.status(200).json({
      message: "Item updated successfully",
      itemData,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
