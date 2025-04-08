import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const getLastRewardTimestamp: Controller = async (req, res) => {
  const { userId } = req.params;
  try {
    if (userId) {
      const result = await userDao.getLastRewardTimestamp(userId);
      res.status(200).json(result);
    } else {
      res.status(400).json({ message: "Bad Request - userId is required" });
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
