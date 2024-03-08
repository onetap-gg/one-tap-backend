import { Dao } from "../../utils/Classes/Dao";

interface DaoType {
    getChallengesInSameGame : (gameId:string) => Promise<any>
    getChallengesNotInSameGame : (gameId:string) => Promise<any>
    getOngoingChallenges : (gameId:string) => Promise<any>
    getCompletedChallenges : (userId:string) => Promise<any>
}

class ChallengesDao extends Dao implements DaoType{
    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }
    getChallengesInSameGame: (gameId:string) => Promise<any> = async (gameId) =>{
        this.dbInstance!.from("game_challenges_active_samegame_view").select("*").eq("gameId",gameId)
    }
    getChallengesNotInSameGame : (gameId: string) => Promise<any> = async (gameId) =>{
        this.dbInstance!.from("game_challenges_active_not_samegame_view").select("*").eq("gameId",gameId)
    }
    getOngoingChallenges : (gameId:string) => Promise<any> = async (gameId) =>{
        this.dbInstance!.from("game_challenges_ongoing_view").select("*").eq("gameId",gameId)
    }
    getCompletedChallenges : (userId : string) => Promise<any> = async (userId) =>{
        this.dbInstance!.from("user_gamechallanges").select(`*`).eq("userId",userId)
    }
}
    
export const challengesDao = new ChallengesDao()