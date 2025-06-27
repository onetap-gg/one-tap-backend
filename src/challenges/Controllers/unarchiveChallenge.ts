import { Controller } from "../../utils/interfaces/controller";
import { challengesDao } from "../Dao/challengesDao";

export const unarchiveChallenge: Controller = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const challenge = await challengesDao.unarchiveChallenge(challengeId);
    res.status(200).json(challenge);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
