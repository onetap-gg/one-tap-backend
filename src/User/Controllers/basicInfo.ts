import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const basicInfoController: Controller = async (req, res) => {
  const { authId } = req.params;
  try {
    const data = await userDao.getUserBasicInfo(authId);
    res.status(200).json(data);
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
