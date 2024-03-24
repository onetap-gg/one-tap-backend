import { object } from "zod";
import { Dao } from "../../Classes/Dao";
import { ChallengeRequirement } from "../ChallengeRequirements";
import { throws } from "assert";

class Dota extends Dao implements ChallengeRequirement{
    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }

    checkIfReqMeet(userAchievement : any , goals:any):boolean{
        const gameReqSchema = CHECK_PROP_NAME_VALID.DOTA
        const propArr = Object.getOwnPropertyNames(goals)
        let achieved = 0;
        propArr.forEach((prop)=>{
            const isValid = gameReqSchema(prop)
            if(isValid){
                const userScore = userAchievement[prop]
                const required = goals[prop]
                if(required === userScore) achieved ++;
            }
            throw new Error("Game Challenge Schema Not valid");
        })
        if(achieved === propArr.length) return true;
        return false;
    } 
}

export const dota = new Dota()