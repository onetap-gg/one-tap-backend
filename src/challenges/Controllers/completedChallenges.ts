import { Controller } from "../../utils/interfaces/controller"
import { challengesDao } from "../Dao/challengesDao"
export const completedChallenges:Controller = async (req,res) =>{
    try{
        const authId = req.params.authId
        const gameId = req.params.gameId
        const challenges = await challengesDao.getCompletedChallenges(gameId,authId)
        res.status(200).json(challenges)
    }catch(err){
        console.log(err)
        res.status(500).json('server Error')
    }
    res.status(200).json()

}