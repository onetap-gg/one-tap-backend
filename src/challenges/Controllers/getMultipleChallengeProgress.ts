import { Controller } from "../../utils/interfaces/controller";
import { challengesDao } from "../Dao/challengesDao";

export const getMultipleChallengeProgress: Controller = async (req, res) => {
  try {
    const userId = req.body.userId;
    const challengeIds = req.body.challengeIds;
    const gameId = req.body.gameId;

    if (!userId || !challengeIds || !gameId || !Array.isArray(challengeIds)) {
      res.status(400).json({ message: "Invalid request parameters" });
      return;
    }

    const progress = await challengesDao.getMultipleChallengeProgress(
      userId,
      challengeIds,
      gameId
    );

    res.status(200).json(progress);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
