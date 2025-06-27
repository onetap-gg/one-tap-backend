import { Controller } from "../../utils/interfaces/controller";
import { leaderBoarDao } from "../Dao/LeaderBoardDao";

type RankWiseFilteredDataArray = ({
  id: string;
  userName: string;
  lifetime_earnings: number;
  UserGame: {
    Game: {
      gameName: string;
    }[];
  }[];
  rank: number;
} | null)[];

export const getAllData: Controller = async (req, res) => {
  try {
    const data = await leaderBoarDao.getAllData();
    const rankWiseFilteredData: RankWiseFilteredDataArray = data!.map(
      (item, index) => ({
        ...item,
        rank: index + 1,
      })
    );
    res.status(200).json(rankWiseFilteredData);
  } catch (err: any) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
