import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const checkUserExistsController: Controller = async (req, res) => {
  const { authId } = req.params;

  try {
    const response = await userDao.checkUserExists(authId);
    console.log(response);
    res.status(200).json(response);
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
