import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const deleteUserController: Controller = async (req, res) => {
  const { authId } = req.params;
  try {
    const response = userDao.deleteUser(authId);
    console.log(response);
    res.status(200).json("User deleted successfully");
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
