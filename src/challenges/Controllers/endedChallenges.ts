import { Controller } from "../../utils/interfaces/controller";
import { challengesDao } from "../Dao/challengesDao";

export const endedChallenges: Controller = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const challenges = await challengesDao.getEndedChallenges(gameId);
    res.status(200).json(challenges);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
