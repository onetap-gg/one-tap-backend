import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const basicInfoAllController: Controller = async (req, res) => {
  try {
    const response = await userDao.getUserBasicInfoAll();
    console.log(response);
    res.status(200).json(response);
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
