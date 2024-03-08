import { Router } from "express";
import { onGoingChallenges } from "../Controllers/onGoingChallenges";
import { completedChallenges } from "../Controllers/completedChallenges";
import { calculateChallengesCompleted } from "../Controllers/calculateChallengesCompleted";

export const challengesRouter = Router()

challengesRouter.get("/completed-challenges/:gameId/:userId",completedChallenges)
challengesRouter.get("/ongoing-challenges/:gameId/:userId",onGoingChallenges)
challengesRouter.post("/update-completed-challenges",calculateChallengesCompleted)
