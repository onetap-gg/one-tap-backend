import { gameDao } from "../../Games/Dao/GameDao"
import { Controller } from "../../utils/interfaces/controller"
import { leaderBoarDao } from "../Dao/LeaderBoardDao"


type RankWiseFilteredDataArray = ({
    id: any;
    User: {
        userName: any;
    }[];
    gameBalance: any;
    gameLevel: any;
    Game: {
        gameName: any;
    }[];
    rank: number;
} | null)[]

type RankWiseFiltered = ({
    id: any;
    User: {
        userName: any;
    }[];
    gameBalance: any;
    gameLevel: any;
    Game: {
        gameName: any;
    }[];
    rank: number;
} | null)

type Game = {
    gameName : any
}

export const getAllData:Controller = async (req,res) =>{
    try{
        let rank =0
        const data = await leaderBoarDao.getAllData()
        const games = await gameDao.getAllGame()
        const rankWiseFilteredData : RankWiseFilteredDataArray = []
        games!.map(game =>{
            let gameName = game.gameName
            let rank =0
            const groupByGameName = data!.filter(dt=>{
                let userGameObject:unknown = dt.Game 
                const userGame = (userGameObject as Game).gameName
                
                if(gameName === userGame){
                    rank++
                    return {rank,...dt} 
                }
                
            })
            rankWiseFilteredData.push(...( groupByGameName as any))
        })
        res.status(200).json(rankWiseFilteredData)
    }catch(err:any){
        console.log(err)
        res.status(500).json("Server Error")
    }    
}