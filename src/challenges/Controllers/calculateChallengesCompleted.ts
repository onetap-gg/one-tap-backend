import { Controller } from "../../utils/interfaces/controller"
import { challengesDao } from "../Dao/challengesDao"
export const calculateChallengesCompleted:Controller = async (req,res) =>{
    try{
        const userId = req.params.userId
        const gameId = req.params.gameId

        const gameData : Array<any> = [];
        const sameGameChallenges = await challengesDao.getChallengesInSameGame(gameId)
        

    }catch(err){
        
    }

}