import { Dao } from "../../utils/Classes/Dao";
import { LeaderBoardDataArray } from "../Types/types";
import {LeaderBoarGameWiseType} from "../Types/types"
interface DaoType {
    getAllData : () => Promise<LeaderBoardDataArray>
    getGameSpecificData : (gameId:string) => Promise<LeaderBoarGameWiseType>
}



class LeaderBoardDao extends Dao implements DaoType {
    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }

    getAllData: () => Promise<LeaderBoardDataArray> = async () =>{
        const {data ,error} = await this.dbInstance!
        .from("UserGame")
        .select(`id, User(userName),gameBalance , gameLevel , Game(gameName)`)
        .order('gameBalance', { ascending: false })
        if(error) this.throwError(error)
        return data
    }

    getGameSpecificData: (gameId: string) => Promise<LeaderBoarGameWiseType> = async (gameId) => {
        const {data , error} =await this.dbInstance!
        .from("UserGame")
        .select(`id, User(userName),gameBalance , gameLevel , Game(gameName)`)
        .eq(`gameId` , gameId)
        .order('gameBalance', { ascending: false })
        if(error) this.throwError(error)
        return data
    }

    
}

export const leaderBoarDao = new LeaderBoardDao ()