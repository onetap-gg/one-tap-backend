import { Controller } from "../../utils/interfaces/controller"
import { requirementFactory } from "../../utils/ChallengeRequirement/ChallengeRequirementFactory/RequirementFactory"
export const uploadChallenges:Controller = async (req,res) =>{
    try{
        try{
            const gameId : number = Number (req.body.gameId)
            const data = req.body.data
            const game = requirementFactory.getRequirement(gameId)
            await game!.uploadChallenges(data)
            res.status(200).json("challenge-uploaded")
        }catch(err){
            console.log(err)
            res.status(500).json('server Error')
        }
        res.status(200).json()
    }catch(err){
        res.status(500).json("server-error")
    }

}