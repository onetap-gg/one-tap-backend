import { challengesDao } from "../Dao/challengesDao";

export const uploadValorantProgress = async (req: any, res: any) => {
  console.log(req.body);
  try {
    const { authId } = req.params;
    const gameData = req.body;
    gameData["authId"] = authId;
    const response = await challengesDao.upsertValorantProgress(gameData);
    console.log(response);
    res.status(200).json(response);
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
