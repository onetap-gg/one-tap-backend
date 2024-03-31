import { gameDao } from "../../Games/Dao/GameDao"
import { Controller } from "../../utils/interfaces/controller"
import { leaderBoarDao } from "../Dao/LeaderBoardDao"


export const getGameSpecificData:Controller = async (req,res) =>{
    try{
        const gameId:string = req.params.gameId!.toString()
        const data = await leaderBoarDao.getGameSpecificData(gameId)
        let rank = 0 ; 
        const rankDataGameWise = data!.map((dt)=>{
            rank++;
            return {rank , ...dt }
        })
        res.status(200).json(rankDataGameWise)
    }catch(err:any){
        console.log(err)
        res.status(500).json("Server Error")
    }    
}


