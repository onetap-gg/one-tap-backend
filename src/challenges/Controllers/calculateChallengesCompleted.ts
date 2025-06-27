import { Controller } from "../../utils/interfaces/controller";
import { challengesDao } from "../Dao/challengesDao";
import { requirementFactory } from "../../utils/ChallengeRequirement/ChallengeRequirementFactory/RequirementFactory";
import { ChallengesInSameGame } from "../Types/types";
import { ChallengesNotInSameGame } from "../Types/types";
import { DotaUptoDateData } from "../../utils/ChallengeRequirement/GameClass/dotaRequirements";
import { VallorentUptoDateData } from "../../utils/ChallengeRequirement/GameClass/vallorentRequirements";
import { FortniteUptoDate } from "../../utils/ChallengeRequirement/GameClass/fortniteRequirements";
import { transactionDao } from "../../Inventory/Dao/TransactionDao";

type completedChallenge = {
  gameId: string;
  userId: string;
  challengeId: string;
};

const resolvePromiseBatchWise = async (
  promiseArray: Array<Promise<any>>,
  batchSize: number
): Promise<any[]> => {
  const len = promiseArray.length;
  let i = 0;
  let currIdx = 0;
  const resultArray: Array<any> = [];
  while (i < len) {
    let j = 0;
    const batchPromiseArray: Array<Promise<any>> = [];
    while (j < batchSize) {
      if (currIdx >= len) break;
      batchPromiseArray.push(promiseArray[currIdx]);
      j++;
      currIdx++;
    }
    const result: Array<any> = await Promise.all(batchPromiseArray);
    result.forEach((dt) => {
      resultArray.push(dt);
    });

    if (currIdx >= len) break;
    i = i + batchSize;
  }
  const batchPromiseArray: Array<Promise<any>> = [];
  while (currIdx < len) {
    batchPromiseArray.push(promiseArray[currIdx]);
    currIdx++;
  }
  const result: Array<any> = await Promise.all(batchPromiseArray);
  result.forEach((dt) => {
    resultArray.push(dt);
  });
  return resultArray;
};

export const calculateChallengesCompleted: Controller = async (req, res) => {
  try {
    const userId = req.body.userId;
    const gameId = req.body.gameId;
    const gameData = req.body.gameData;
    console.log("gameId", gameId);
    console.log("gameData", gameData);

    const sameGameChallengesPromise =
      challengesDao.getNonCompletedChallengesInSameGame(gameId, userId);
    const notSameGameChallengesPromise =
      challengesDao.getNonCompletedChallengesNotInSameGame(gameId, userId);

    let notCompChallSameGame: ChallengesInSameGame = [];
    let notCompChallNotSameGame: ChallengesNotInSameGame = [];
    try {
      console.log("Fetching challenges for gameId:", gameId, "userId:", userId);
      const resolvedPromises = await Promise.allSettled([
        sameGameChallengesPromise,
        notSameGameChallengesPromise,
      ]);

      if (resolvedPromises[0].status === "fulfilled") {
        notCompChallSameGame = resolvedPromises[0].value;
        console.log("Same game challenges result:", notCompChallSameGame);
      }
      if (resolvedPromises[1].status === "fulfilled") {
        notCompChallNotSameGame = resolvedPromises[1].value;
        console.log(
          "Not same game challenges result:",
          notCompChallNotSameGame
        );
      }
    } catch (err) {
      console.error("Error fetching challenges:", err);
    }

    if (notCompChallSameGame === null) notCompChallSameGame = [];
    if (notCompChallNotSameGame === null) notCompChallNotSameGame = [];

    console.log("--------------Not completed Challenges ---------------");
    console.log("not completed same game challenge", notCompChallSameGame);
    console.log(
      "not completed not same game challenge",
      notCompChallNotSameGame
    );
    console.log("-------------------------------------------------------");

    let totalReward = 0;
    const completedChallenges: Array<any> = [];

    const challengeProvider = requirementFactory.getRequirement(Number(gameId));
    const completedChallengeSameGame: Array<completedChallenge> = [];
    const updateProgressArray: Array<any> = [];
    const progressMp = new Map<number, number>();
    // console.log("same_gmae_challenge" ,sameGameChallengesPromise )
    // console.log(notCompChallSameGame , "test")
    console.log("length not comp chall same game", notCompChallSameGame.length);
    notCompChallSameGame.forEach((challenge) => {
      // console.log("inside the foreach")
      const requirements = challenge.requirements;
      const challengeId = challenge.id;
      const { isCompleted, percentage } = challengeProvider?.checkIfReqMeet(
        gameData,
        requirements
      ) || { isCompleted: false, percentage: 0 };
      console.log("isCompleted", isCompleted, "percentage", percentage);
      if (isCompleted) {
        completedChallengeSameGame.push({ gameId, userId, challengeId });
        totalReward += challenge.reward;
        // Add progress tracking for completed inSameGame challenges
        updateProgressArray.push({
          requirement: gameData,
          challengeId: challengeId,
          userId: userId,
        });
        progressMp.set(challengeId, percentage);
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
    const data = await challengeProvider!.updateMatchDetails(gameData, userId);
    // const uploadProgress = await challengeProvider!.uploadProgress(userId,gameData)

    // console.log("updated data" , data);
    const promiseArrayNotSameGame: Array<Promise<any>> = [];

    // console.log("this is it", notCompChallNotSameGame);

    const getDataUptoDateArgs: any = [];
    notCompChallNotSameGame.forEach((ch) => {
      const startTime = ch.startTime;
      const endTime = ch.endTime;
      getDataUptoDateArgs.push({ startTime, endTime });
    });

    const matchDetails = await challengeProvider!.getDataUptoDate(
      getDataUptoDateArgs,
      userId
    );

    // console.log("MATCH details" , matchDetails);

    const progress: Array<any> = [];

    // console.log("notsamegamechallenge" , notCompChallNotSameGame)

    notCompChallNotSameGame.forEach((ntComplete, i) => {
      const requirement = ntComplete.requirements;

      console.log("match details ", matchDetails);
      const total = challengeProvider!.calculateTotal(
        matchDetails,
        requirement
      );
      const totalAny = total as any;
      console.log("not same game total challenge", total);
      const { isCompleted, percentage } = challengeProvider!.checkIfReqMeet(
        totalAny,
        requirement
      );
      console.log("iscompleted", isCompleted);
      progressMp.set(ntComplete.id, percentage);
      if (isCompleted) {
        // Add to completedChallenges with the same structure as inSameGame challenges
        completedChallenges.push({
          gameId,
          challengeId: ntComplete.id,
          userId,
        });
        totalReward += ntComplete.reward;
        updateProgressArray.push({
          requirement: total,
          challengeId: ntComplete.id,
          userId,
        });
      } else {
        updateProgressArray.push({
          requirement: total,
          challengeId: ntComplete.id,
          userId,
        });
      }
    });

    console.log(
      "progress , completed challenges , total rewards",
      progress,
      completedChallenges,
      totalReward
    );

    const result = await challengesDao.updateChallengesCompleted(
      completedChallenges
    );
    let coins = 0;

    if (totalReward > 0) {
      coins = await challengesDao.updateTotalCoins(userId, totalReward);

      // Record transaction for each completed challenge
      for (const challenge of completedChallenges) {
        await transactionDao.recordTransaction({
          userId,
          amount: totalReward,
          type: "EARN",
          source: "CHALLENGE",
          sourceId: challenge.challengeId,
        });
      }
    }

    const getCompletedChallengePromiseArray: Array<Promise<any>> = [];

    result.forEach((res: any) => {
      const challengeId = res.challengeId;
      const promise = challengesDao.getCompletedChallengeById(challengeId);
      getCompletedChallengePromiseArray.push(promise);
    });

    const completedChall = await resolvePromiseBatchWise(
      getCompletedChallengePromiseArray,
      3
    );

    console.log("update progress array", updateProgressArray, coins);

    let updateProgress = [];
    if (updateProgressArray.length > 0) {
      console.log("update progress array: ", updateProgressArray);
      updateProgress = await challengeProvider!.upsertProgress(
        updateProgressArray
      );
    }

    console.log("uploadProgess : ", updateProgress);

    const progressWithPercentage = updateProgress.map((p) => {
      console.log("mapping upload progress: ", p);
      const id = p.id;
      const percentage = progressMp.get(id);
      return { ...p, percentage };
    });

    // Ensure notInSameGame challenges have the same structure as inSameGame challenges
    // This preserves the working structure for inSameGame challenges
    const processedCompletedChallenges = completedChall.map(
      (challenge: any) => {
        // If the challenge is missing required fields that inSameGame challenges have,
        // add them with default values
        if (!challenge.Game || !challenge.game_challenges) {
          return {
            ...challenge,
            Game: challenge.Game || [],
            game_challenges: challenge.game_challenges || { name: "" },
          };
        }
        // Otherwise, return the challenge as is (preserving the working structure)
        return challenge;
      }
    );

    res.status(200).json({
      progressWithPercentage,
      balance: coins,
      challenges: processedCompletedChallenges,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("server error");
  }
};
