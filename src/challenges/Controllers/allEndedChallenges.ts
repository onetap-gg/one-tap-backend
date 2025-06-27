import { Controller } from "../../utils/interfaces/controller";
import { challengesDao } from "../Dao/challengesDao";

export const allEndedChallenges: Controller = async (req, res) => {
  try {
    const challenges = await challengesDao.getAllEndedChallenges();
    res.status(200).json(challenges);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
