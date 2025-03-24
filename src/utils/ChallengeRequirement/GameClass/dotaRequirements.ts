import { object } from "zod";
import { Dao } from "../../Classes/Dao";
type StartEndPair = { 
    start: Date; 
    end: Date; 
  };
  
  type GetDataUptoDateParams = { 
    
  };
  
interface IDota {
    checkIfReqMeet : (userAchievement : DotaUserData , goals:DotaUptoDateData) => {isCompleted : boolean , percentage : number}
    updateMatchDetails : (matchData : DotaUptoDateData ,userId :string) => Promise<DotaUptoDateDataArray> 
    calculateTotal : (matches : DotaUptoDateDataArray , challenge : DotaUptoDateData) => DotaUptoDateData
    uploadChallenges : (data : any) => Promise<void>
    uploadProgress : (data : UploadProgress) => Promise<any>
    getProgressData : (userId : string) => Promise<any>
    upsertProgress : (progress:UpsertData) => Promise<any>  
    getDataUptoDate : (startEndPairs: StartEndPair[], userId: string ) => Promise<any>
}
type UpsertData = Array<{requirement : DotaUserData , userId :string  , challengeId :string ,isCompleted:boolean}>

type UploadProgress = Array<{requirement : DotaUserData , userId :string  , challengeId :string}>
type progress = {requirement : DotaUserData , userId :string  , challengeId :string , isCompleted:boolean}

type UpsertProgress = Array<{requirement : DotaUserData , userId :string  , challengeId :string , id : string}>

export type DotaUptoDateDataArray ={
    id: number;
    match_start: string;
    match_end: string;
    kills: number;
    assists: number;
    death: number;
    creep_score: number;
    physical_damage_dealt_players: number;
    Auth: string;
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
    Auth: string;
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

    checkIfReqMeet(userAchievement : DotaUserData , goals:DotaUptoDateData):{isCompleted : boolean , percentage : number}{
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

        let total : number = 0;
        let player : number = 0;

        total = goals.assists + goals.creep_score + goals.death + goals.kills + goals.physical_damage_dealt_players
        player = userAchievement.assists + userAchievement.creep_score + userAchievement.death + userAchievement.kills + userAchievement.physical_damage_dealt_players
        let percentage = (player / total ) * 100 ;
        let isCompleted = false ; 
        if(achieved === 5) isCompleted = true;
        return {isCompleted , percentage}
    } 

    async updateMatchDetails(matchData: DotaUserData, userId: string) {
        const {data , error } = await this.dbInstance!.from("dota_data").insert({...matchData,userId}).select()
        if(error) this.throwError(error);
        return data;
    };

    async getDataUptoDate(startEndPairs: StartEndPair[], userId: string) {
        console.log("Fetching data for:", startEndPairs, "UserId:", userId);
      
        // Convert Date objects to ISO strings
        const formattedRanges = startEndPairs.map(({ start, end }) => ({
          start: start.toISOString(),
          end: end.toISOString(),
        }));
      
        // Build OR conditions for all start-end ranges
        const rangeConditions = formattedRanges
          .map(({ start, end }) => `(match_start.gte.${start},match_end.lte.${end})`)
          .join(",");
      
        const { data, error } = await this.dbInstance!.from("dota_data")
          .select(
            `id, 
            match_start, 
            match_end, 
            kills, 
            assists, 
            death, 
            creep_score, 
            physical_damage_dealt_players, 
            Auth, 
            match_status`
          )
          .or(rangeConditions)
          .eq("Auth", userId);
      
        if (error) this.throwError(error);
      
        console.log("Fetched Data:", data);
        return data;
      }
      

    calculateTotal(matches: DotaUptoDateDataArray ,challenge : DotaUptoDateData){
        
        
        const status = challenge.match_status
        const total : DotaUptoDateData = 
        {match_status:status,match_start : "" , match_end: "", id : 0 , Auth :"",kills : 0  , assists : 0 , death : 0 , creep_score : 0 , physical_damage_dealt_players : 0 }

        matches!.forEach(match => {
        
                total.assists += match.assists
                total.kills += match.kills
                total.creep_score += match.creep_score
                total.death += match.death
                total.physical_damage_dealt_players += match.physical_damage_dealt_players
        });
        return total
    }

    uploadChallenges: (data: any) => Promise<void> = async (data) =>{
        const res = await this.dbInstance!.from("game_challenges").insert([...data])
        if(res.error) this.throwError(res.error)
    }

    async uploadProgress (progress :UploadProgress){
        const {data ,error} = await this.dbInstance!.from("dota_progress").insert([...progress]).select()
        if(error) this.throwError(error);
        return data;
    }

    async upsertProgress(progress : UpsertData){
        const challengeIdArray : Array<string> = [] ;
        const progressMp = new Map<string , progress>();
        
        console.log("progress" , progress);

        progress.forEach((pr)=>{
            const id = pr.challengeId
            progressMp.set(id , pr);
            challengeIdArray.push(id.toString());
        })

        let res ,data ,error

        console.log("challengeArray", progressMp)
        if(challengeIdArray.length>0){
            res = await this.dbInstance!!.from("vallorent_progress").select("id , challengeId ,Auth , requirement").in("challengeId" ,challengeIdArray );
            data = res.data;
            error = res.error
            if(error) this.throwError(error);
        }
            
        const updateArray: UploadProgress = []
        const insertArray :UploadProgress = []
        const deleteArray : Array <string>   = []

        if(data){
            data.forEach((dt)=>{
                const id = dt.challengeId;
                const found = progressMp.get(id);
                console.log("found",found);
                if(found){
                    if(found.isCompleted){
                        deleteArray.push(dt.id)
                    }else{
                        updateArray.push({...dt , requirement :found.requirement, userId: dt.Auth });
                    }
                    progressMp.delete(id);
                } 
            })
        }
        
        progressMp.forEach((val , key)=>{
            if(!val.isCompleted){
                const requirement = val.requirement
                const challengeId = val.challengeId
                const userId = val.userId
                insertArray.push({requirement , challengeId , userId});
            }
        })

        let update , insert , del ;
        
        console.log("hey there what a sudden surprise " , challengeIdArray ,deleteArray , insertArray ,updateArray)

        if(updateArray.length>0) update = this.dbInstance!.from("vallorent_progress").upsert([...updateArray]).select()
        if(insertArray.length>0) insert = this.dbInstance!.from("vallorent_progress").insert([...insertArray]).select()
        if(deleteArray.length >0) del = this.dbInstance!.from("vallorent_progress").delete().in("id" , deleteArray)
        
        const promiseArray = []

        if(updateArray.length) promiseArray.push(update)
        if(insertArray.length) promiseArray.push(insert) 
        if(deleteArray.length) promiseArray.push(del)

        const resp : any = await Promise.all(promiseArray);

        const updatedProgress :Array<any> = []
        resp.forEach((res : any,i:number)=>{
            if(res.error) this.throwError(res.error)
            if(i!= 2)
            updatedProgress.push(res.data)
        })

        return updatedProgress
    }


    async getProgressData(userId : string ){
        const {data,error} = await this.dbInstance!.from("dota_progress").select("*");
        if(error) this.throwError(error)
        return data;
    }
}

export const dota = new Dota()