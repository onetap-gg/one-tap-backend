import { Controller } from "../../utils/interfaces/controller";
import { requirementFactory } from "../../utils/ChallengeRequirement/ChallengeRequirementFactory/RequirementFactory";
import { vallorent } from "../../utils/ChallengeRequirement/GameClass/vallorentRequirements";
export const deleteChallenge: Controller = async (req, res) => {
  try {
    try {
      const gameId: number = Number(req.body.gameId);
      const challengeId = req.body.id;
      const game = requirementFactory.getRequirement(gameId);
      if (game === vallorent) {
        await game!.deleteChallenge(challengeId);
        res.status(200).json("challenge-delete");
      }
      res.status(200).json("challenge-delete method not available for this game");
    } catch (err) {
      console.log(err);
      res.status(500).json("server Error");
    }
    res.status(200).json();
  } catch (err) {
    res.status(500).json("server-error");
  }
};
