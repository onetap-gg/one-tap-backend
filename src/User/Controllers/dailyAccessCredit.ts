import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";

export const dailyAccessCredits: Controller = async (req, res) => {
  const { userId , lastLoginTime } = req.body;
  try {
    if(userId && lastLoginTime){
        let coins =0;
        if(lastLoginTime - Date.now() < 24*60*60*1000)
            coins = await userDao.updateCredit(userId);
        res.status(200).json(coins);
    }
    else {
        res.status(400).json('Bad Request')
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json("server error");
  }
};
