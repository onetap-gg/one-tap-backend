import { Controller } from "../../utils/interfaces/controller";
import { leaderBoarDao } from "../Dao/LeaderBoardDao";

export const getGameSpecificData: Controller = async (req, res) => {
  try {
    const gameId: string = req.params.gameId!.toString();
    const data = await leaderBoarDao.getGameSpecificData(gameId);
    const rankDataGameWise = data!.map((dt, index) => ({
      ...dt,
      rank: index + 1,
    }));
    res.status(200).json(rankDataGameWise);
  } catch (err: any) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
