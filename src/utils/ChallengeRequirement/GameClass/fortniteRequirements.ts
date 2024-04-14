import { Dao } from "../../Classes/Dao";

interface IFortnite {
    checkIfReqMeet : (userAchievement : FortniteUserData , goals:FortniteUptoDate) => boolean
    updateMatchDetails : (matchData : FortniteUserData ,userId :string) => Promise<FortniteUptoDateArray> 
    getDataUptoDate : (start : Date , end: Date , userId : string) => Promise<any>
    calculateTotal : (matches : FortniteUptoDateArray , challenge: FortniteUptoDate) => FortniteUptoDate
    uploadChallenges : (data : any) => Promise<void>
    uploadProgress : (data : UploadProgress) => Promise<any>
    getProgressData : (userId : string) => Promise<any>
    upsertProgress : (progress:UploadProgress) => Promise<any> 
}

type UploadProgress = Array<{requirement : FortniteUserData , userId :string  , challengeId :string}>
type progress = {requirement : FortniteUserData , userId :string  , challengeId :string}

type UpsertProgress = Array<{requirement : FortniteUserData , userId :string  , challengeId :string ,id :string}>

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

class Fortnite extends Dao implements IFortnite{
    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }

    checkIfReqMeet(userAchievement : FortniteUserData , goals:FortniteUptoDate):boolean{
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
        const {data ,error} = await this.dbInstance!.from("fortnite_progress").insert([...progress]).select()
        if(error) this.throwError(error);
        return data;
    }

    async upsertProgress(progress : UploadProgress){
        const challengeIdArray : Array<string> = [] ;
        const progressMp = new Map<string , progress>();
        progress.forEach((pr)=>{
            const id = pr.challengeId
            progressMp.set(id , pr);
        })

        progress.forEach((pr)=>{
            const id = pr.challengeId
            challengeIdArray.push(id.toString());
        })


        let res ,data ,error

        console.log("challengeArray" , challengeIdArray)
        if(challengeIdArray.length>0){
            res = await this.dbInstance!!.from("fortnite_progress").select(" id, challengeId ,userId , requirement").in("challengeId" ,challengeIdArray );
            data = res.data;
            error = res.error
            if(error) this.throwError(error);
        }
            
        
        
        const updateArray:UpsertProgress = []
        const insertArray :UploadProgress = []

        if(data){
            data.forEach((dt)=>{
                const id = dt.challengeId;
                const found = progressMp.get(id);
                if(found){
                    updateArray.push({...dt , requirement :found.requirement});
                    progressMp.delete(id);
                } 
            })
        }
    
        progressMp.forEach((val , key)=>{
            insertArray.push(val);
        })

        let update , insert 
        
        console.log("hey there what a sudden surprise " , challengeIdArray , insertArray ,updateArray)

        if(updateArray.length>0) update = this.dbInstance!!.from("fortnite_progress").upsert([...updateArray]).select()
        if(insertArray.length>0) insert = this.dbInstance!!.from("fortnite_progress").insert([...insertArray]).select()
        
        const promiseArray = []

        if(updateArray.length) promiseArray.push(update)
        if(insertArray.length) promiseArray.push(insert) 

        const resp : any = await Promise.all(promiseArray);

        const updatedProgress :Array<any> = []
        resp.forEach((res : any)=>{
            if(res.error) this.throwError(res.error)
            updatedProgress.push(res.data)
        })

        return updatedProgress
    }

    async getProgressData(userId : string ){
        const {data,error} = await this.dbInstance!.from("fornite_progress").select("*");
        if(error) this.throwError(error)
        return data;
    }
}

export const fortnite = new Fortnite()