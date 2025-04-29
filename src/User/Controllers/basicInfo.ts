import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const basicInfoController: Controller = async (req, res) => {
  const { authId } = req.params;
  try {
    const suspension = await userDao.checkUserSuspension(authId);
    const deletion = await userDao.checkUserDeletion(authId);
    if (suspension) {
      res.status(403).json("User is suspended");
    } else if (deletion) {
      res.status(403).json("User is deleted");
    } else {
      const data = await userDao.getUserBasicInfo(authId);
      res.status(200).json(data);
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
