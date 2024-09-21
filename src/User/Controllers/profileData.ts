import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const profileInfoController: Controller = async (req, res) => {
  const { authId } = req.params;
  try {
    const data = await userDao.getUserProfileData(authId);
    const coins: number = await userDao.getBalance(authId);
    const x = coins / 100;
    const level = Math.pow(x, 0.8);
    res.status(200).json({ ...data, level });
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
