import { Controller } from "../../utils/interfaces/controller"
import { userDao } from "../Dao/userDao"

export const profileInfoController: Controller =  async (req,res)  =>{
    try{
        const userData = req.body.data;
        const userId  = req.body.userId;
        const data = await userDao.updateUserBasicInfo(userData , userId)
        res.status(200).json(data);
    }catch(err :any){
        console.log(err)
        res.status(500).json("server error")
    }
}