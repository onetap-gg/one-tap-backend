import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const createProfileController: Controller = async (req, res) => {
  const userData = req.body.data;
  const authId = req.params;
  userData["Auth"] = authId;
  userData["lifetime_earnings"] = 0;
  const { data, error } = await userDao.createUserProfile(userData);
  console.log(data, error);
  if (!error) {
    res.status(200).json(data);
  } else {
    res.status(500).json(error);
  }
};
