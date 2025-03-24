import { Controller } from "../../utils/interfaces/controller";
import { challengesDao } from "../Dao/challengesDao";
export const completedChallenges: Controller = async (req, res) => {
  try {
    const userId = req.params.userId;
    const gameId = req.params.gameId;
    const challenges = await challengesDao.getCompletedChallenges(
      gameId,
      userId
    );
    res.status(200).json(challenges);
  } catch (err) {
    console.log(err);
    res.status(500).json("server Error");
  }
};
