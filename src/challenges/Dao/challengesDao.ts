import { Dao } from "../../utils/Classes/Dao";
import { ChallengesInSameGame } from "../Types/types";
import { ChallengesNotInSameGame } from "../Types/types";
import { OnGoingChallenges } from "../Types/types";
import { CompletedChallenges } from "../Types/types";


interface DaoType {
    getChallengesInSameGame : (gameId:string) => Promise<ChallengesInSameGame>
    getChallengesNotInSameGame : (gameId:string) => Promise<ChallengesNotInSameGame>
    getOngoingChallenges : (gameId:string) => Promise<OnGoingChallenges>
    getCompletedChallenges : (gameId :string,userId:string) => Promise<CompletedChallenges>
    updateChallengesCompleted : (gameId : string,user_gamechallanges_id :string) => Promise<void>
}

class ChallengesDao extends Dao implements DaoType{
    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }

    getChallengesInSameGame: (gameId:string) => Promise<ChallengesInSameGame> = async (gameId) =>{
        const {data,error} = await this.dbInstance!
        .from("game_challenges_active_samegame_view")
        .select("id,Game(gameName), Challanges(requirements) , startTime ,endTime ,type, name")
        .eq("gameId",gameId)
        if(error) this.throwError(error)
        return data
    }

    getChallengesNotInSameGame : (gameId: string) => Promise<ChallengesNotInSameGame> = async (gameId) =>{
        const {data,error} = await this.dbInstance!.from("game_challenges_active_not_samegame_view")
        .select("id,Game(gameName), Challanges(requirements) , startTime ,endTime ,type, name")
        .eq("gameId",gameId)
        if(error) this.throwError(error)
        return data
    }

    getOngoingChallenges : (gameId:string) => Promise<OnGoingChallenges> = async (gameId) =>{
        const {data,error} = await this.dbInstance!.from("game_challenges_ongoing_view")
        .select("id,Game(gameName), Challanges(requirements) , startTime ,endTime ,type, name")
        .eq("gameId",gameId)
        if(error) this.throwError(error)
        return data;
    }

    getCompletedChallenges : (gameId:string,userId : string) => Promise<CompletedChallenges> = async (gameId,userId) =>{
        const {data,error} = await this.dbInstance!.from("user_gamechallanges")
        .select("id,userId , game_challenges(Game(gameName) , startTime ,endTime ,type , name , Challanges(requirements))")
        .eq("userId",userId).eq("game_challenges(Game(id))" , gameId)
        if(error) this.throwError(error)
        return data
    }
    
    updateChallengesCompleted : (userId: string,user_gamechallanges_id :string) => Promise<void> = async (userId : string,user_gamechallanges_id :string) =>{
        const {data , error } = await this.dbInstance!.from("user_gamechallanges").insert([{userId , user_gamechallanges_id}])
        if(error) this.throwError(error);
    } 
}
    
export const challengesDao = new ChallengesDao()