import { Dao } from "../../Classes/Dao";
import { ChallengeRequirement } from "../ChallengeRequirements";

interface IFortnite {
    checkIfReqMeet : (userAchievement : FortniteUptoDate , goals:FortniteUptoDate) => boolean
    updateMatchDetails : (matchData : FortniteUserData ,userId :string) => Promise<FortniteUptoDateArray> 
    getDataUptoDate : (start : Date , end: Date , userId : string) => Promise<any>
    calculateTotal : (matches : FortniteUptoDateArray , challenge: FortniteUptoDate) => FortniteUptoDate
    updateTotalCoins : (userId :string , coins  : number) => Promise<any> ;
}

export type FortniteUptoDateArray ={
    id : number
    match_start: string;
    match_end: string;
    kills: number;
    knockout: number;
    revived: number;
    health: number;
    total_shots: number;
    shield: number ;
    mode : string
    userId: any;
    match_status : boolean,

}[] | null

export type FortniteUptoDate = {
    id : number
    match_start: string;
    match_end: string;
    kills: number;
    knockout: number;
    revived: number;
    health: number;
    total_shots: number;
    shield: number ;
    mode : string
    userId: any;
    match_status : boolean,
}

export type FortniteUserData = {
    match_start: string;
    match_end: string;
    kills: number;
    knockout: number;
    revived: number;
    health: number;
    total_shots: number;
    shield: number ;
    mode : string
    match_status : boolean,
}

export type FortniteMatchTotal = {
    won : FortniteUptoDate
    loss : FortniteUptoDate
}

class Fortnite extends Dao implements IFortnite{
    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }

    checkIfReqMeet(userAchievement : FortniteUptoDate , goals:FortniteUptoDate):boolean{
        let achieved =0;
        if(userAchievement.health >= goals.health){
            achieved++
        }
        else if(userAchievement.knockout >= goals.knockout){
            achieved++
        }
        else if(userAchievement.revived >= goals.revived){
            achieved++
        }
        else if(userAchievement.kills >= goals.kills){
            achieved++
        }
        else if(userAchievement.shield >= goals.shield){
            achieved++
        }
        else if(userAchievement.total_shots >= goals.total_shots){
            achieved++
        }

        if(achieved === 6) return true;
        return false;
    } 

    async getDataUptoDate(start: Date, end: Date,userId : string){
        const {data , error} = await this.dbInstance!.from("fortnite_data").select(
            `id , match_start,match_end,kills,knockout,revived,health,total_shots ,shield,userId ,mode ,match_status`
        )
        .gte("match_start" , start)
        .lte("match_end" ,  end)
        .eq("userId" , userId)
        if(error) this.throwError(error)
        return data
    }

    async updateMatchDetails(matchData : FortniteUserData ,userId :string){
        const {data , error } = await this.dbInstance!.from("fortnite_data").insert({...matchData,userId}).select()
        if(error) this.throwError(error);
        return data;
    }
    calculateTotal(matches : FortniteUptoDateArray, challenge : FortniteUptoDate){
        const status = challenge.match_status
        const total : FortniteUptoDate = {match_status:status,match_start : "" , match_end: "", id : 0 , userId :"", kills: 0 , knockout : 0 , revived : 0 , health : 0 , total_shots : 0, shield :  0 ,mode:""}
        matches!.forEach((match)=>{
            if(status === match.match_status){
                total.health +=  match.health 
                total.kills += match.kills
                total.knockout+= match.knockout
                total.revived += match.revived
                total.shield += match.shield
                total.total_shots += match.total_shots
            }
        })
        return total
    }
    updateTotalCoins : (userId :string , coins  : number) => Promise<any> = async (userid , coins)=>{

    }

}

export const fortnite = new Fortnite()