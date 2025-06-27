import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const dailyAccessCredits: Controller = async (req, res) => {
  const { userId } = req.body;
  try {
    if (userId) {
      const result = await userDao.checkAndUpdateDailyReward(userId);
      if (result) {
        res.status(200).json({
          message: "Daily reward claimed successfully",
          balance: result.balance,
        });
      } else {
        res.status(200).json({ message: "Daily reward already claimed today" });
      }
    } else {
      res.status(400).json({ message: "Bad Request - userId is required" });
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
