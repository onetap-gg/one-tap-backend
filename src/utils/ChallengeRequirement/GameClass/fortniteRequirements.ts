import { number } from "zod";
import { Dao } from "../../Classes/Dao";

interface IFortnite {
    checkIfReqMeet : (userAchievement : FortniteUserData , goals:FortniteUptoDate) => {isCompleted : boolean , percentage : number}
    updateMatchDetails : (matchData : FortniteUserData ,authId :string) => Promise<FortniteUptoDateArray> 
    getDataUptoDate : (start : Date , end: Date , authId : string) => Promise<any>
    calculateTotal : (matches : FortniteUptoDateArray , challenge: FortniteUptoDate) => FortniteUptoDate
    uploadChallenges : (data : any) => Promise<void>
    uploadProgress : (data : UploadProgress) => Promise<any>
    getProgressData : (authId : string) => Promise<any>
    upsertProgress : (progress:UpsertData) => Promise<any> 
}
type UpsertData = Array<{requirement : FortniteUserData , authId :string  , challengeId :string ,isCompleted:boolean}>
type UploadProgress = Array<{requirement : FortniteUserData , authId :string  , challengeId :string}>
type progress = {requirement : FortniteUserData , authId :string  , challengeId :string , isCompleted:boolean}

type UpsertProgress = Array<{requirement : FortniteUserData , authId :string  , challengeId :string ,id :string}>

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
    authId: any;
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
    authId: any;
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

class Fortnite extends Dao implements IFortnite{
    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }

    checkIfReqMeet(userAchievement : FortniteUserData , goals:FortniteUptoDate): {isCompleted : boolean , percentage : number}{
        let achieved =0;
        if(userAchievement.health >= goals.health){
            achieved++
        }
        if(userAchievement.knockout >= goals.knockout){
            achieved++
        }
        if(userAchievement.revived >= goals.revived){
            achieved++
        }
        if(userAchievement.kills >= goals.kills){
            achieved++
        }
        if(userAchievement.shield >= goals.shield){
            achieved++
        }
        if(userAchievement.total_shots >= goals.total_shots){
            achieved++
        }

        let total : number  =0;
        let player : number =0;

        player = userAchievement.health + userAchievement.knockout + userAchievement.revived + userAchievement.kills + userAchievement.shield + userAchievement.total_shots

        total = goals.health + goals.knockout + goals.revived + goals.kills + goals.shield + goals.total_shots

        const percentage = (player / total) * 100; 
        let isCompleted = false;
        if(achieved === 6) isCompleted =  true;
        return {isCompleted , percentage};
    } 

    async getDataUptoDate(start: Date, end: Date,authId : string){
        console.log("getDataUptoDate" ,start , end ,authId)
        const {data , error} = await this.dbInstance!.from("fortnite_data").select(
            `id , match_start,match_end,kills,knockout,revived,health,total_shots ,shield,authId ,mode ,match_status`
        )
        .gte("match_start" , start)
        .lte("match_end" ,  end)
        .eq("authId" , authId)
        if(error) this.throwError(error)
        return data
    }

    async updateMatchDetails(matchData : FortniteUserData ,authId :string){
        const {data , error } = await this.dbInstance!.from("fortnite_data").insert({...matchData,authId}).select()
        if(error) this.throwError(error);
        return data;
    }
    calculateTotal(matches : FortniteUptoDateArray, challenge : FortniteUptoDate){
        const status = challenge.match_status
        const total : FortniteUptoDate = {match_status:status,match_start : "" , match_end: "", id : 0 , authId :"", kills: 0 , knockout : 0 , revived : 0 , health : 0 , total_shots : 0, shield :  0 ,mode:""}
        matches!.forEach((match)=>{
                total.health +=  match.health 
                total.kills += match.kills
                total.knockout+= match.knockout
                total.revived += match.revived
                total.shield += match.shield
                total.total_shots += match.total_shots
        })
        return total
    }
    uploadChallenges: (data: any) => Promise<void> = async (data) =>{
        const res = await this.dbInstance!.from("game_challenges").insert([...data])
        if(res.error) this.throwError(res.error)
        return 
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
            res = await this.dbInstance!!.from("vallorent_progress").select("id , challengeId ,authId , requirement").in("challengeId" ,challengeIdArray );
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
                        updateArray.push({...dt , requirement :found.requirement });
                    }
                    progressMp.delete(id);
                } 
            })
        }
        
        progressMp.forEach((val , key)=>{
            if(!val.isCompleted){
                const requirement = val.requirement
                const challengeId = val.challengeId
                const authId = val.authId
                insertArray.push({requirement , challengeId , authId});
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


    async getProgressData(authId : string ){
        const {data,error} = await this.dbInstance!.from("fornite_progress").select("*");
        if(error) this.throwError(error)
        return data;
    }
}

export const fortnite = new Fortnite()