import { Request, Response } from "express";
import { itemDao } from "../Dao/ItemDao";

export const archiveItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const data = await itemDao.archiveItem(itemId as unknown as number);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
