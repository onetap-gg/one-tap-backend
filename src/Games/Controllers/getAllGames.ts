import { Controller } from "../../utils/interfaces/controller"
import { gameDao } from "../Dao/GameDao"
export const getAllData:Controller = async (req,res) =>{
    try{
        const games = await gameDao.getAllGame()
        res.status(200).json(games)
    }catch(err){
        console.log(err)
        res.status(500).json('server Error')
    }
    res.status(200).json()
}