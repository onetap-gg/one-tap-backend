import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const unsuspendUserController: Controller = async (req, res) => {
  const { authId } = req.params;
  try {
    const response = userDao.unsuspendUser(authId);
    console.log(response);
    res.status(200).json("User unsuspended successfully");
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
