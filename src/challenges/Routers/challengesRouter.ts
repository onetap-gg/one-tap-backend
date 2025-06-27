import { Router } from "express";

import { onGoingChallenges } from "../Controllers/onGoingChallenges";
import { completedChallenges } from "../Controllers/completedChallenges";
import { calculateChallengesCompleted } from "../Controllers/calculateChallengesCompleted";
import { uploadChallenges } from "../Controllers/uploadChallenges";
import { getProgress } from "../Controllers/getProgress";
import { getAllChallenges } from "../Controllers/getAllChallenges";
import { editChallenge } from "../Controllers/editChallenge";
import { deleteChallenge } from "../Controllers/deleteChallenge";
import { allOngoingChallenges } from "../Controllers/allOngoingChallenges";
import { allCompletedChallenges } from "../Controllers/allCompletedChallenges";
import { endedChallenges } from "../Controllers/endedChallenges";
import { allEndedChallenges } from "../Controllers/allEndedChallenges";
import { getMultipleChallengeProgress } from "../Controllers/getMultipleChallengeProgress";
import { getChallengesGroupedByLevel } from "../Controllers/getChallengesGroupedByLevel";
import { archiveChallenge } from "../Controllers/archiveChallenge";
import { unarchiveChallenge } from "../Controllers/unarchiveChallenge";

export const challengesRouter = Router();

challengesRouter.get(
  "/completed-challenges/:gameId/:userId",
  completedChallenges
);
challengesRouter.get("/ongoing-challenges/:gameId", onGoingChallenges);
challengesRouter.post(
  "/update-completed-challenges",
  calculateChallengesCompleted
);
challengesRouter.post("/upload-challenges", uploadChallenges);
challengesRouter.get("/get-progress/:gameId/:userId", getProgress);
challengesRouter.get("/all-data", getAllChallenges);
challengesRouter.post("/edit-challenge", editChallenge);
challengesRouter.post(
  "/delete-challenge/:gameId/:challengeId",
  deleteChallenge
);
challengesRouter.get("/all-ongoing-challenges", allOngoingChallenges);
challengesRouter.get(
  "/all-completed-challenges/:userId",
  allCompletedChallenges
);
challengesRouter.get("/ended-challenges/:gameId", endedChallenges);
challengesRouter.get("/all-ended-challenges", allEndedChallenges);
challengesRouter.post(
  "/multiple-challenge-progress",
  getMultipleChallengeProgress
);
challengesRouter.get("/grouped-by-level", getChallengesGroupedByLevel);
challengesRouter.get("/archive/:challengeId", archiveChallenge);
challengesRouter.get("/unarchive/:challengeId", unarchiveChallenge);
