"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateChallengesCompleted = void 0;
const challengesDao_1 = require("../Dao/challengesDao");
const RequirementFactory_1 = require("../../utils/ChallengeRequirement/ChallengeRequirementFactory/RequirementFactory");
const resolvePromiseBatchWise = (promiseArray, batchSize) => __awaiter(void 0, void 0, void 0, function* () {
    const len = promiseArray.length;
    let i = 0;
    let currIdx = 0;
    const resultArray = [];
    while (i < len) {
        let j = 0;
        const batchPromiseArray = [];
        while (j < batchSize) {
            if (currIdx >= len)
                break;
            batchPromiseArray.push(promiseArray[currIdx]);
            j++;
            currIdx++;
        }
        const result = yield Promise.all(batchPromiseArray);
        result.forEach((dt) => {
            resultArray.push(dt);
        });
        if (currIdx >= len)
            break;
        i = i + batchSize;
    }
    const batchPromiseArray = [];
    while (currIdx < len) {
        batchPromiseArray.push(promiseArray[currIdx]);
        currIdx++;
    }
    const result = yield Promise.all(batchPromiseArray);
    result.forEach((dt) => {
        resultArray.push(dt);
    });
    return resultArray;
});
const calculateChallengesCompleted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const gameId = req.body.gameId;
        const gameData = req.body.gameData;
        console.log("gameId", gameId);
        console.log("gameData", gameData);
        const sameGameChallengesPromise = challengesDao_1.challengesDao.getChallengesInSameGame(gameId);
        const notSameGameChallengesPromise = challengesDao_1.challengesDao.getChallengesNotInSameGame(gameId);
        const getCompletedChallengesPromise = challengesDao_1.challengesDao.getCompletedChallenges(gameId, userId);
        let totalReward = 0;
        const notCompChallSameGame = [];
        const notCompChallNotSameGame = [];
        try {
            const resolvedPromises = yield Promise.all([
                sameGameChallengesPromise,
                notSameGameChallengesPromise,
                getCompletedChallengesPromise,
            ]);
            const sameGameChallenges = resolvedPromises[0];
            const notSameGameChallenges = resolvedPromises[1];
            const getCompletedChallenges = resolvedPromises[2];
            console.log("same game challenges", sameGameChallenges);
            console.log("not same game Challenge", notSameGameChallenges);
            console.log("completed challenges", getCompletedChallenges);
            notSameGameChallenges === null || notSameGameChallenges === void 0 ? void 0 : notSameGameChallenges.forEach((notSameGame) => {
                let isPresent = false;
                getCompletedChallenges === null || getCompletedChallenges === void 0 ? void 0 : getCompletedChallenges.forEach((completedChallenge) => {
                    const completedChallengeId = completedChallenge.challengeId;
                    if (notSameGame.id === completedChallengeId) {
                        isPresent = true;
                    }
                });
                if (!isPresent)
                    notCompChallNotSameGame.push(notSameGame);
            });
            sameGameChallenges === null || sameGameChallenges === void 0 ? void 0 : sameGameChallenges.forEach((sameGame) => {
                let isPresent = false;
                getCompletedChallenges === null || getCompletedChallenges === void 0 ? void 0 : getCompletedChallenges.forEach((completedChallenge) => {
                    const completedChallengeId = completedChallenge.challengeId;
                    if (sameGame.id === completedChallengeId) {
                        isPresent = true;
                    }
                });
                if (!isPresent)
                    notCompChallSameGame.push(sameGame);
            });
        }
        catch (err) {
            console.log(err);
            console.log("Data Not able to fetch");
        }
        console.log("--------------Not completed Challenges ---------------");
        console.log("not completed same game challenge", notCompChallSameGame);
        console.log("not completed not same game challenge", notCompChallNotSameGame);
        console.log("-------------------------------------------------------");
        const completedChallenges = [];
        const completedChallengesServer = [];
        const challengeProvider = RequirementFactory_1.requirementFactory.getRequirement(Number(gameId));
        const completedChallengeSameGame = [];
        // console.log("same_gmae_challenge" ,sameGameChallengesPromise )
        // console.log(notCompChallSameGame , "test")
        console.log("length not comp chall same game", notCompChallSameGame.length);
        notCompChallSameGame.forEach((challenge) => {
            // console.log("inside the foreach")
            const requirements = challenge.requirements;
            const challengeId = challenge.id;
            const isComp = challengeProvider === null || challengeProvider === void 0 ? void 0 : challengeProvider.checkIfReqMeet(gameData, requirements);
            console.log(isComp, "is comp");
            if (isComp) {
                completedChallengeSameGame.push({ gameId, userId, challengeId });
                totalReward += challenge.reward;
            }
        });
        // console.log("completed challenges same game" ,completedChallengeSameGame)
        completedChallengeSameGame.forEach((ch) => {
            completedChallenges.push({
                gameId: ch.gameId,
                challengeId: ch.challengeId,
                userId: ch.userId,
            });
        });
        const data = yield challengeProvider.updateMatchDetails(gameData, userId);
        // const uploadProgress = await challengeProvider!.uploadProgress(userId,gameData)
        // console.log("updated data" , data);
        const promiseArrayNotSameGame = [];
        // console.log("this is it", notCompChallNotSameGame);
        notCompChallNotSameGame.forEach((ch) => {
            const promise = challengeProvider.getDataUptoDate(ch.startTime, ch.endTime, userId);
            promiseArrayNotSameGame.push(promise);
        });
        const matchDetails = yield resolvePromiseBatchWise(promiseArrayNotSameGame, 3);
        // console.log("MATCH details" , matchDetails);
        const progress = [];
        // console.log("notsamegamechallenge" , notCompChallNotSameGame)
        const updateProgressArray = [];
        const progressMp = new Map();
        notCompChallNotSameGame.forEach((ntComplete, i) => {
            const requirement = ntComplete.requirements;
            console.log("match details ", matchDetails[i]);
            //! yeh check karna hai 
            const total = challengeProvider.calculateTotal(matchDetails[i], requirement);
            const totalAny = total;
            console.log("not same game total challenge", total);
            const { isCompleted, percentage } = challengeProvider.checkIfReqMeet(totalAny, requirement);
            console.log("iscompleted", isCompleted);
            progressMp.set(ntComplete.id, percentage);
            if (isCompleted) {
                completedChallenges.push({
                    gameId,
                    challengeId: ntComplete.id,
                    userId,
                });
                totalReward += ntComplete.reward;
                updateProgressArray.push({
                    requirement: total,
                    challengeId: ntComplete.id,
                    // isCompleted: true,
                    userId,
                });
            }
            else {
                updateProgressArray.push({
                    requirement: total,
                    challengeId: ntComplete.id,
                    // isCompleted: false,
                    userId,
                });
            }
        });
        console.log("progress , completed challenges , total rewards", progress, completedChallenges, totalReward);
        const result = yield challengesDao_1.challengesDao.updateChallengesCompleted(completedChallenges);
        let coins = 0;
        if (totalReward > 0)
            coins = yield challengesDao_1.challengesDao.updateTotalCoins(userId, totalReward);
        const getCompletedChallengePromiseArray = [];
        result.forEach((res) => {
            const challengeId = res.challengeId;
            const promise = challengesDao_1.challengesDao.getCompletedChallengeById(challengeId);
            getCompletedChallengePromiseArray.push(promise);
        });
        const completedChall = yield resolvePromiseBatchWise(getCompletedChallengePromiseArray, 3);
        console.log("update progress array", updateProgressArray, coins);
        let updateProgress = [];
        if (updateProgressArray.length > 0) {
            console.log("update progress array: ", updateProgressArray);
            updateProgress = yield challengeProvider.upsertProgress(updateProgressArray);
        }
        console.log("uploadProgess : ", updateProgress);
        const progressWithPercentage = updateProgress.map((p) => {
            console.log("mapping upload progress: ", p);
            const id = p.id;
            const percentage = progressMp.get(id);
            return Object.assign(Object.assign({}, p), { percentage });
        });
        res.status(200).json({
            progressWithPercentage,
            balance: coins,
            challenges: completedChall,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json("server error");
    }
});
exports.calculateChallengesCompleted = calculateChallengesCompleted;
