import { Dao } from "../../Classes/Dao";

interface IVallorent {
    checkIfReqMeet : (userAchievement : VallorentUserData , goals:VallorentUptoDateData) => {isCompleted : boolean , percentage : number}
    updateMatchDetails : (matchData : VallorentUserData ,authId :string) => Promise<VallorentUptoDateDataArray> 
    getDataUptoDate : (start : string , end: string , authId : string) => Promise<VallorentUptoDateDataArray>
    calculateTotal : (matches : VallorentUptoDateDataArray , challenge : VallorentUptoDateData) => VallorentUptoDateData
    uploadChallenges : (data : any) => Promise<void>
    uploadProgress : (data : UploadProgress) => Promise<any>
    getProgressData : (authId : string) => Promise<any>
    upsertProgress : (progress:UpsertData) => Promise<any> 

}
type UpsertData = Array<{requirement : VallorentUserData , authId :string  , challengeId :string ,isCompleted:boolean}>

type UploadProgress = Array<{requirement : VallorentUserData , authId :string  , challengeId :string }>
type progress = {requirement : VallorentUserData , authId :string  , challengeId :string , isCompleted:boolean}

type UpsertProgress = Array<{requirement : VallorentUserData , authId :string  , challengeId :string , id: string ,isCompleted:string}>

export type VallorentUptoDateDataArray = {
    id: number;
    match_start: string;
    match_end: string;
    total_kills: number;
    deaths: number;
    assists: number;
    headshot: number;
    spikes_planted: number;
    spikes_defuse: number;
    damage_done: number;
    team_scores: number;
    match_status: boolean;
    agent: string;
    region: string;
    game_mode: string;
    damage_taken: number;
    authId : string
}[] | null

export type VallorentUptoDateData = {
    id: number;
    match_start: string;
    match_end: string;
    total_kills: number;
    deaths: number;
    assists: number;
    headshot: number;
    spikes_planted: number;
    spikes_defuse: number;
    damage_done: number;
    team_scores: number;
    match_status: boolean;
    agent: string;
    region: string;
    game_mode: string;
    damage_taken: number;
    authId : string
}


export type VallorentUserData = {
    match_start: string;
    match_end: string;
    total_kills: number;
    deaths: number;
    assists: number;
    headshot: number;
    spikes_planted: number;
    spikes_defuse: number;
    damage_done: number;
    team_scores: number;
    match_status: boolean;
    agent: string;
    region: string;
    game_mode: string;
    damage_taken: null;
}

class Vallorent extends Dao implements IVallorent{
    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }



    checkIfReqMeet(userAchievement : VallorentUserData , goal:VallorentUptoDateData){
        // console.log( "user achievement" , userAchievement , goal)
        if(userAchievement === null) this.throwError("Null object")
        let achieved = 0;
        // console.log("assists" , "user_assists" ,userAchievement.assists , "goal_assists",goal.assists)
        // console.log("spikes_defuse" , "spikes_defuse" ,userAchievement.spikes_defuse , "spikes_defuse",goal.spikes_defuse)
        if(userAchievement.assists >= goal.assists){
            
            achieved ++ 
            console.log(1)
        }if(userAchievement.damage_done >= goal.damage_done){
            achieved ++
            console.log(2)
        }if(userAchievement.damage_taken!= null && userAchievement.damage_taken >= goal.damage_taken){
            achieved ++
            console.log(3)
        }if(userAchievement.deaths >= goal.deaths){
            achieved ++
            console.log(4)
        }if(userAchievement.headshot >= goal.headshot){
            achieved ++
            console.log(5)
        }if(userAchievement.spikes_defuse >= goal.spikes_defuse){
                
            achieved ++
            console.log(6)
        }if(userAchievement.spikes_planted >= goal.spikes_planted){
            achieved ++
            console.log(7)
        }if(userAchievement.team_scores >= goal.team_scores){
            achieved ++
            console.log(8)
        }if(userAchievement.total_kills >= goal.total_kills){
            achieved ++
            console.log(9)
        }
        let total : number  =0;
        let player : number =0; 
        // console.log("amount of match property" ,achieved)
        total = goal.assists + goal.damage_done + goal.damage_taken + goal.deaths + goal.headshot + goal.spikes_defuse + goal.spikes_planted + goal.team_scores + goal.total_kills; 
        if(userAchievement.damage_taken)
        player = userAchievement.assists + userAchievement.damage_done + userAchievement.damage_taken + userAchievement.deaths + userAchievement.headshot + userAchievement.spikes_defuse + userAchievement.spikes_planted + userAchievement.team_scores + userAchievement.total_kills; 
        
        let percentage : number = (player / total ) * 100;

        let isCompleted = false;
        if(achieved === 9) isCompleted =  true;
        return {isCompleted , percentage};
    } 
    

    async updateMatchDetails(matchData: VallorentUserData, authId: string){
        const {data , error} = await this.dbInstance!.from("valorent_data").insert({...matchData,authId}).select()
        if(error) this.throwError(error);
        return data;
    }  

    async getDataUptoDate(start: string, end: string , authId :string){
        console.log("hello" ,start ,end , authId);
        const {data , error} = await this.dbInstance!.from("valorent_data")
        .select(`id , match_start ,match_end ,total_kills , deaths ,assists ,headshot , spikes_planted ,spikes_defuse , damage_done ,team_scores ,   match_status , agent, region ,game_mode ,damage_taken,authId`)
        .gte("match_start" , start)
        .lte("match_end" ,  end)
        .eq("authId" , authId)
        if(error) this.throwError(error)
        console.log("getDataUptoDate" , data)
        return data
    }

    calculateTotal (matches  : VallorentUptoDateDataArray , challenge : VallorentUptoDateData){
        const status = challenge.match_status;
        const total : VallorentUptoDateData = {id: 0,
            match_start: "",
            match_end: "",
            total_kills: 0,
            deaths: 0,
            assists: 0,
            headshot: 0,
            spikes_planted: 0,
            spikes_defuse: 0, 
            damage_done: 0,
            team_scores: 0,
            match_status:status,
            agent: "",
            region: "",
            game_mode: "",
            damage_taken: 0,
            authId : ""
        }
        
        matches!.forEach(match => {
                total.assists += match.assists
                total.damage_done += match.damage_done
                total.damage_taken += match.damage_taken
                total.deaths +=  match.deaths
                total.headshot += match.headshot
                total.spikes_defuse += match.spikes_defuse
                total.spikes_planted += match.spikes_planted
                total.team_scores += match.team_scores
                total.total_kills += match.total_kills
        });

        return total
    }

    uploadChallenges: (data: any) => Promise<void> = async (data) =>{
        const res = await this.dbInstance!.from("game_challenges").insert([...data])
        if(res.error) this.throwError(res.error)
    }

    async uploadProgress (progress :UploadProgress){
        const {data ,error} = await this.dbInstance!.from("vallorent_progress").insert([...progress]).select()
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
        const {data,error} = await this.dbInstance!.from("vallorent_progress").select("*");
        if(error) this.throwError(error)
        return data;
    }
}

export const vallorent = new Vallorent()