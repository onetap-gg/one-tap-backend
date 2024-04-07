import { Controller } from "../../utils/interfaces/controller"
import { challengesDao } from "../Dao/challengesDao"
export const onGoingChallenges:Controller = async (req,res) =>{
    try{
        try{
            const gameId = req.params.gameId
            const challenges = await challengesDao.getOngoingChallenges(gameId)
            res.status(200).json(challenges)
        }catch(err){
            console.log(err)
            res.status(500).json('server Error')
        }
        res.status(200).json()
    }catch(err){
        res.status(500).json("Server Error")
    }
}