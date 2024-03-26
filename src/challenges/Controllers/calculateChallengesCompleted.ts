import { Controller } from "../../utils/interfaces/controller"
import { challengesDao } from "../Dao/challengesDao"
import { requirementFactory } from "../../utils/ChallengeRequirement/ChallengeRequirementFactory/RequirementFactory"
import { ChallengesInSameGame } from "../Types/types"
import { ChallengesNotInSameGame } from "../Types/types"

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
         

        const sameGameChallenge = resolvePromiseBatchWise(completedChallSameGame ,3);

       

        res.status(201).json(sameGameChallenge)
        // not in the same game 

    }catch(err){
        console.log(err)
    }

}