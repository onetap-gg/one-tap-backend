import { Controller } from "../../utils/interfaces/controller"
import { challengesDao } from "../Dao/challengesDao"
export const calculateChallengesCompleted:Controller = async (req,res) =>{
    try{
        const userId = req.body.userId
        const gameId = req.body.gameId
        const gameData = req.body.gameId
        const gameName = req.body.gameName; 
        const gameChallengesStatus = []
        const sameGameChallenges = await challengesDao.getChallengesInSameGame(gameId)
        sameGameChallenges?.forEach(challenge =>{
            const requirement = challenge.Challanges[0].requirements
            const game_challanges_id =  challenge.id
            challengesDao.updateChallengesCompleted(gameId, game_challanges_id)
        })
        
        const 

        res.status(201).send(JSON.stringify(gameChallengesStatus))
        
        const notSameGameChallenges = await challengesDao.getChallengesNotInSameGame(gameId)
        

    }catch(err){
        
    }

}