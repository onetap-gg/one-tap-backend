import { Controller } from "../../utils/interfaces/controller"
import { requirementFactory } from "../../utils/ChallengeRequirement/ChallengeRequirementFactory/RequirementFactory"
export const getProgress:Controller = async (req,res) =>{
    try{
        const userId = req.params.userId
        const gameId = Number (req.params.gameId)
        const game = requirementFactory.getRequirement(gameId);
        const progress = await game!.getProgressData(userId);

        res.status(200).json(progress)
    }catch(err){
        console.log(err)
        res.status(500).json('server Error')
    }
    res.status(200).json()

}