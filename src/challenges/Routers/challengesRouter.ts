import { Router } from "express";

import { onGoingChallenges } from "../Controllers/onGoingChallenges";
import { completedChallenges } from "../Controllers/completedChallenges";
import { calculateChallengesCompleted } from "../Controllers/calculateChallengesCompleted";
import { uploadChallenges } from "../Controllers/uploadChallenges";
import {uploadValorantProgress} from "../Controllers/uploadValorantProgress"

export const challengesRouter = Router()

challengesRouter.get("/completed-challenges/:gameId/:authId",completedChallenges)
challengesRouter.get("/ongoing-challenges/:gameId",onGoingChallenges)
challengesRouter.post("/update-completed-challenges",calculateChallengesCompleted)
challengesRouter.post("/upload-challenges",uploadChallenges)
challengesRouter.get("/get-progress/:gameId/:authId")
challengesRouter.post("/valorant/progress/:authId", uploadValorantProgress)