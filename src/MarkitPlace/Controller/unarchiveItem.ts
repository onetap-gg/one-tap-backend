import { Request, Response } from "express";
import { itemDao } from "../Dao/ItemDao";

export const unarchiveItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const data = await itemDao.unarchiveItem(itemId as unknown as number);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
