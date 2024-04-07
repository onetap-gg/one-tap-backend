import { object } from "zod";
import { Dao } from "../../Classes/Dao";

interface IDota {
    checkIfReqMeet : (userAchievement : DotaUserData , goals:DotaUptoDateData) => boolean
    updateMatchDetails : (matchData : DotaUptoDateData ,userId :string) => Promise<DotaUptoDateDataArray> 
    getDataUptoDate : (start : Date , end: Date , userId :string) => Promise<DotaUptoDateDataArray>
    calculateTotal : (matches : DotaUptoDateDataArray , challenge : DotaUptoDateData) => DotaUptoDateData
    uploadChallenges : (data : any) => Promise<void>
}

export type DotaUptoDateDataArray ={
    id: number;
    match_start: string;
    match_end: string;
    kills: number;
    assists: number;
    death: number;
    creep_score: number;
    physical_damage_dealt_players: number;
    userId: string;
    match_status : boolean
}[] | null


export type DotaUptoDateData = {
    id: number;
    match_start: string;
    match_end: string;
    kills: number;
    assists: number;
    death: number;
    creep_score: number;
    physical_damage_dealt_players: number;
    userId: string;
    match_status : boolean
}

export type DotaMatchTotal = {
    won : DotaUptoDateData,
    loss : DotaUptoDateData
}

export type DotaUserData = {
    match_start: string;
    match_end: string;
    kills: number;
    assists: number;
    death: number;
    creep_score: number;
    physical_damage_dealt_players: number;
    match_status : boolean
}


class Dota extends Dao implements IDota{

    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }

    checkIfReqMeet(userAchievement : DotaUserData , goals:DotaUptoDateData):boolean{
        let achieved = 0;
        if(userAchievement.assists >=  goals.assists){
            achieved ++;
        }
        if(userAchievement.creep_score >= goals.creep_score){
            achieved ++;
        }
        if(userAchievement.death >= goals.death) {
            achieved ++;
        }
        if(userAchievement.kills >= goals.kills){
            achieved ++;
        }
        if(userAchievement.physical_damage_dealt_players >= goals.physical_damage_dealt_players){
            achieved ++;
        }

        if(achieved === 5) return true;
        return false;
    } 

    async updateMatchDetails(matchData: DotaUserData, userId: string) {
        const {data , error } = await this.dbInstance!.from("dota_data").insert({...matchData,userId}).select()
        if(error) this.throwError(error);
        return data;
    };

    async getDataUptoDate(start: Date, end: Date,userId : string){
        const {data , error} = await this.dbInstance!.from("dota_data").select(
        `id, 
        match_start,
        match_end, 
        kills, 
        assists,
        death, 
        creep_score, 
        physical_damage_dealt_players,
        userId,
        match_status
        `
        )
        .gte("match_start" , start)
        .lte("match_end" ,  end)
        .eq("userId" , userId)
        if(error) this.throwError(error)
        return data
    }

    calculateTotal(matches: DotaUptoDateDataArray ,challenge : DotaUptoDateData){
        
        
        const status = challenge.match_status
        const total : DotaUptoDateData = 
        {match_status:status,match_start : "" , match_end: "", id : 0 , userId :"",kills : 0  , assists : 0 , death : 0 , creep_score : 0 , physical_damage_dealt_players : 0 }

        matches!.forEach(match => {
        
            if(match.match_status === status){
                total.assists += match.assists
                total.kills += match.kills
                total.creep_score += match.creep_score
                total.death += match.death
                total.physical_damage_dealt_players += match.physical_damage_dealt_players
            }
        });
        return total
    }

    uploadChallenges: (data: any) => Promise<void> = async (data) =>{
        const res = await this.dbInstance!.from("game_challenges").insert({...data})
        if(res.error) this.throwError(res.error)
    }
}

export const dota = new Dota()