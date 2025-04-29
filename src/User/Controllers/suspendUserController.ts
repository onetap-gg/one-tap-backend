import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const suspendUserController: Controller = async (req, res) => {
  const { authId } = req.params;
  try {
    const response = userDao.suspendUser(authId);
    console.log(response);
    res.status(200).json("User suspended successfully");
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
