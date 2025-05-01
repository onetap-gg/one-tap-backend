import { Controller } from "../../utils/interfaces/controller";
import { itemDao } from "../Dao/ItemDao";

export const getItems: Controller = async (req, res) => {
  try {
    const data = await itemDao.getItems();
    res.status(200).json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json("Server Error");
  }
};
