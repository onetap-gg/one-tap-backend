"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengesRouter = void 0;
const express_1 = require("express");
const onGoingChallenges_1 = require("../Controllers/onGoingChallenges");
const completedChallenges_1 = require("../Controllers/completedChallenges");
const calculateChallengesCompleted_1 = require("../Controllers/calculateChallengesCompleted");
const uploadChallenges_1 = require("../Controllers/uploadChallenges");
const getProgress_1 = require("../Controllers/getProgress");
exports.challengesRouter = (0, express_1.Router)();
exports.challengesRouter.get("/completed-challenges/:gameId/:userId", completedChallenges_1.completedChallenges);
exports.challengesRouter.get("/ongoing-challenges/:gameId", onGoingChallenges_1.onGoingChallenges);
exports.challengesRouter.post("/update-completed-challenges", calculateChallengesCompleted_1.calculateChallengesCompleted); ///// add to call after match end
exports.challengesRouter.post("/upload-challenges", uploadChallenges_1.uploadChallenges);
exports.challengesRouter.get("/get-progress/:gameId/:userId", getProgress_1.getProgress);
