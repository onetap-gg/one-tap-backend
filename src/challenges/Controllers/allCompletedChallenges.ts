import { Controller } from "../../utils/interfaces/controller";
import { challengesDao } from "../Dao/challengesDao";

export const allCompletedChallenges: Controller = async (req, res) => {
  try {
    const userId = req.params.userId;
    const challenges = await challengesDao.getAllCompletedChallenges(userId);
    res.status(200).json(challenges);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
