export interface ChallengeRequirement{
    checkIfReqMeet : (userAchievement : any , goals:any) => boolean
    updateMatchDetails : (matchData : any ,userId :string) => Promise<any> 
    getDataUptoDate : (start : Date , end: Date) => Promise<any>
    calculateTotalInInterval : (start : Date , end :Date , obj : any) => any
}


