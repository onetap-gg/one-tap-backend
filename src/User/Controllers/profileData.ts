import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const profileInfoController: Controller = async (req, res) => {
  const { userId } = req.params;
  try {
    const data = await userDao.getUserProfileData(userId);
    const userInfo = await userDao.getUserBasicInfo(userId);
    if (!userInfo) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const level = Math.floor(userInfo.lifetime_earnings / 600) + 1;
    res.status(200).json({
      ...data,
      level,
      globalRanking: userInfo.globalRanking,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
