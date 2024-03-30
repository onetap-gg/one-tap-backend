import { Controller } from "../../utils/interfaces/controller"
import { challengesDao } from "../Dao/challengesDao"
import { requirementFactory } from "../../utils/ChallengeRequirement/ChallengeRequirementFactory/RequirementFactory"
import { ChallengesInSameGame } from "../Types/types"
import { ChallengesNotInSameGame } from "../Types/types"

import { VallorentUptoDateData } from "../../utils/ChallengeRequirement/GameClass/vallorentRequirements" 
import { DotaUptoDateData } from "../../utils/ChallengeRequirement/GameClass/dotaRequirements"
import { FortniteUptoDate } from "../../utils/ChallengeRequirement/GameClass/fortniteRequirements"

type completedChallenge ={
    gameId :string,
    userId : string,
    challengeId :string
}

const resolvePromiseBatchWise = async (promiseArray : Array<Promise<any>> , batchSize:number): Promise<any[]> =>{
    const len = promiseArray.length;
    let i =0;
    let currIdx = 0;
    const resultArray: Array<any> = [];
    while(i <len){
        let j=0;
        const batchPromiseArray : Array<Promise<any>> =[]
        while(j<batchSize){
            if(currIdx>=len) break;
            batchPromiseArray.push(promiseArray[currIdx])
            j++;
            currIdx++;
        }
        const result: Array<any> = await Promise.all(batchPromiseArray)
        result.forEach((dt)=>{
            resultArray.push(dt)
        })

        if(currIdx>=len) break;
        i=i+batchSize;
    }
    const batchPromiseArray : Array<Promise<any>> =[]
    while(currIdx<len){
        batchPromiseArray.push(promiseArray[currIdx])
        currIdx++;
    }
    const result: Array<any> = await Promise.all(batchPromiseArray)
    result.forEach((dt)=>{
        resultArray.push(dt)
    })
    return resultArray
}

export const calculateChallengesCompleted:Controller = async (req,res) =>{
    try{
        const userId = req.body.userId
        const gameId = req.body.gameId
        const gameData = req.body.gameData


        const sameGameChallengesPromise = challengesDao.getChallengesInSameGame(gameId)
        const notSameGameChallengesPromise = challengesDao.getChallengesNotInSameGame(gameId)
        const getCompletedChallengesPromise =  challengesDao.getCompletedChallenges(gameId,userId)

        const notCompChallSameGame :ChallengesInSameGame = [];
        const notCompChallNotSameGame :ChallengesNotInSameGame = [];

        Promise.all(
            
            [sameGameChallengesPromise , 
            notSameGameChallengesPromise , 
            getCompletedChallengesPromise]

            ).then((resolvedPromises)=>{
                
            const sameGameChallenges = resolvedPromises[0]
            const notSameGameChallenges = resolvedPromises[1]
            const getCompletedChallenges = resolvedPromises[2]

            
            notSameGameChallenges?.forEach((notSameGame)=>{
                let isPresent = false;
                getCompletedChallenges?.forEach((completedChallenge)=>{
                    const completedChallengeId = completedChallenge.id
                    if(notSameGame.id === completedChallengeId){
                        isPresent = true
                    }
                })
                if(!isPresent)
                notCompChallNotSameGame.push(notSameGame)
            })

            sameGameChallenges?.forEach((sameGame)=>{
                let isPresent = false;
                getCompletedChallenges?.forEach((completedChallenge)=>{
                    const completedChallengeId = completedChallenge.id
                    if(sameGame.id === completedChallengeId){
                        isPresent = true
                    }
                    if(!isPresent)
                    notCompChallSameGame.push(sameGame)
                })
            })

            getCompletedChallenges?.forEach((completedChallenge)=>{
                
                
            })
        }).catch((err)=>{
            throw new Error(err)
        })
        
        const challengeProvider = requirementFactory.getRequirement(gameId)
        const completedChallengeSameGame :Array<completedChallenge> = []

        notCompChallSameGame.forEach((challenge)=>{
           const requirements = challenge.requirements
           const challengeId = challenge.id
           const isComp = challengeProvider?.checkIfReqMeet( gameData,requirements)
            if(isComp){
                completedChallengeSameGame.push({gameId , userId ,challengeId})
            }
        })

        const completedChallSameGame: Array<Promise<any>> = [] 

        completedChallengeSameGame.forEach((ch)=>{
            const promise = challengesDao.updateChallengesCompleted(ch.gameId , ch.challengeId , ch.userId)
            completedChallSameGame.push(promise);
        })
        
        const sameGameChallenge = await resolvePromiseBatchWise(completedChallSameGame ,3);

       
        await challengeProvider!.updateMatchDetails(gameData, userId)

        const promiseArrayNotSameGame: Array<Promise<any>> = []
        

        notCompChallNotSameGame.forEach((ch)=>{
            const promise = challengeProvider!.getDataUptoDate(ch.startTime ,ch.endTime,userId)
            promiseArrayNotSameGame.push(promise);
        })

        const matchDetails = await resolvePromiseBatchWise(promiseArrayNotSameGame , 3)
        
        const completedNotSameGameChall : Array<string> = [];
        const progress : Array<any> = []
        notCompChallNotSameGame.forEach((ntComplete ,i)=>{
            const requirement = ntComplete.requirements
            const total = challengeProvider!.calculateTotal(matchDetails[i] , requirement)
            const totalAny = total as any 
            const isCompleted = challengeProvider!.checkIfReqMeet(totalAny , requirement)
            if(isCompleted)
            completedNotSameGameChall.push(ntComplete.id);
            else if(isCompleted === false){
                progress.push(total)
            }
        })
    
        const notSmGamePromiseArray: Array<Promise<any>> = [] 

        completedNotSameGameChall.forEach((ch)=>{
            const promise = challengesDao.updateChallengesCompleted(gameId , ch , userId)
            notSmGamePromiseArray.push(promise);
        })
        
        const ntSameGameChall = await resolvePromiseBatchWise(completedChallSameGame ,3);
        const completed = [...sameGameChallenge, ...ntSameGameChall]

        res.status(201).json({completed,progress})
        
    }catch(err){
        console.log(err)
        res.status(500).json("server error")
    }

}