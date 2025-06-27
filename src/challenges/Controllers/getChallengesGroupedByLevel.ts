import { Controller } from "../../utils/interfaces/controller";
import { challengesDao } from "../Dao/challengesDao";

export const getChallengesGroupedByLevel: Controller = async (req, res) => {
  try {
    try {
      const groupedChallenges =
        await challengesDao.getChallengesGroupedByLevel();
      res.status(200).json(groupedChallenges);
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
};
