import { number } from "zod";
import { Dao } from "../../utils/Classes/Dao";
import { ChallengesInSameGame } from "../Types/types";
import { ChallengesNotInSameGame } from "../Types/types";
import { OnGoingChallenges } from "../Types/types";
import { CompletedChallenges } from "../Types/types";
import { ChallengesGroupedByLevel } from "../Types/types";

type updateCompletedChallenges = Array<{
  gameId: string;
  challengeId: string;
  userId: string;
}>;

interface DaoType {
  getChallengesInSameGame: (gameId: string) => Promise<ChallengesInSameGame>;
  getChallengesNotInSameGame: (
    gameId: string
  ) => Promise<ChallengesNotInSameGame>;
  getOngoingChallenges: (gameId: string) => Promise<OnGoingChallenges>;
  getCompletedChallenges: (
    gameId: string,
    userId: string
  ) => Promise<CompletedChallenges>;
  getAllCompletedChallenges: (userId: string) => Promise<CompletedChallenges>;
  updateChallengesCompleted: (
    completed: updateCompletedChallenges
  ) => Promise<any>;
  updateTotalCoins: (userId: string, coins: number) => Promise<any>;
  getAllChallenges: () => Promise<OnGoingChallenges>;
  getEndedChallenges: (gameId: string) => Promise<OnGoingChallenges>;
  getAllEndedChallenges: () => Promise<OnGoingChallenges>;
  getMultipleChallengeProgress: (
    userId: string,
    challengeIds: string[],
    gameId: string
  ) => Promise<any>;
  getChallengesGroupedByLevel: () => Promise<ChallengesGroupedByLevel>;
  archiveChallenge: (challengeId: string) => Promise<any>;
  unarchiveChallenge: (challengeId: string) => Promise<any>;
}

class ChallengesDao extends Dao implements DaoType {
  constructor() {
    super();
    if (this.dbInstance === null) this.throwError("DB instance is not present");
  }

  getChallengesInSameGame: (gameId: string) => Promise<ChallengesInSameGame> =
    async (gameId) => {
      this.logMethodCall("getChallengesInSameGame", { gameId });
      const { data, error } = await this.dbInstance!.from(
        "game_challenges_active_insamegame_view"
      )
        .select(
          "id,Game(gameName,id), requirements , startTime ,endTime ,type, name , reward"
        )
        .eq("gameId", gameId);
      if (error) this.throwError(error);
      this.logMethodResult("getChallengesInSameGame", data);
      return data;
    };

  getChallengesNotInSameGame: (
    gameId: string
  ) => Promise<ChallengesNotInSameGame> = async (gameId) => {
    this.logMethodCall("getChallengesNotInSameGame", { gameId });
    const { data, error } = await this.dbInstance!.from(
      "game_challenges_active_not_insamegame_view"
    )
      .select(
        "id,Game(gameName,id), requirements, startTime ,endTime ,type, name ,reward"
      )
      .eq("gameId", gameId);
    if (error) this.throwError(error);
    this.logMethodResult("getChallengesNotInSameGame", data);
    return data;
  };

  getNonCompletedChallengesInSameGame: (
    gameId: string,
    userId: string
  ) => Promise<any> = async (gameId, userId) => {
    this.logMethodCall("getNonCompletedChallengesInSameGame", {
      gameId,
      userId,
    });

    // First get the completed challenge IDs
    const { data: completedChallenges, error: completedError } =
      await this.dbInstance!.from("completed_challenges")
        .select("challengeId")
        .eq("gameId", gameId)
        .eq("userId", userId);

    if (completedError) this.throwError(completedError);

    const completedIds = completedChallenges?.map((c) => c.challengeId) || [];
    console.log("Completed challenge IDs:", completedIds);

    // Then get challenges not in the completed list
    const { data, error } = await this.dbInstance!.from(
      "game_challenges_active_insamegame_view"
    )
      .select(
        "id, gameId, Game:gameId(gameName, id), requirements, startTime, endTime, type, name, reward"
      )
      .eq("gameId", gameId);

    if (error) this.throwError(error);
    console.log("All available challenges:", data);

    // Filter out completed challenges
    const filteredData =
      data?.filter((challenge) => !completedIds.includes(challenge.id)) || [];
    console.log("Filtered challenges (excluding completed):", filteredData);

    this.logMethodResult("getNonCompletedChallengesInSameGame", filteredData);
    return filteredData;
  };

  getNonCompletedChallengesNotInSameGame: (
    gameId: string,
    userId: string
  ) => Promise<any> = async (gameId, userId) => {
    this.logMethodCall("getNonCompletedChallengesNotInSameGame", {
      gameId,
      userId,
    });

    // First get the completed challenge IDs
    const { data: completedChallenges, error: completedError } =
      await this.dbInstance!.from("completed_challenges")
        .select("challengeId")
        .eq("gameId", gameId)
        .eq("userId", userId);

    if (completedError) this.throwError(completedError);

    const completedIds = completedChallenges?.map((c) => c.challengeId) || [];

    // Then get challenges not in the completed list
    const { data, error } = await this.dbInstance!.from(
      "game_challenges_active_not_insamegame_view"
    )
      .select(
        "id, gameId, Game:gameId(gameName, id), requirements, startTime, endTime, type, name, reward"
      )
      .eq("gameId", gameId);

    if (error) this.throwError(error);

    // Filter out completed challenges
    const filteredData =
      data?.filter((challenge) => !completedIds.includes(challenge.id)) || [];

    this.logMethodResult(
      "getNonCompletedChallengesNotInSameGame",
      filteredData
    );
    return filteredData;
  };

  getOngoingChallenges: (gameId: string) => Promise<OnGoingChallenges> = async (
    gameId
  ) => {
    this.logMethodCall("getOngoingChallenges", { gameId });
    const { data, error } = await this.dbInstance!.from(
      "game_challenges_ongoing_view"
    )
      .select(
        "id,Game(gameName), requirements , startTime ,endTime ,type, name,reward, level"
      )
      .eq("gameId", gameId);
    if (error) this.throwError(error);
    this.logMethodResult("getOngoingChallenges", data);
    return data;
  };

  getAllOngoingChallenges: () => Promise<OnGoingChallenges> = async () => {
    this.logMethodCall("getAllOngoingChallenges");
    const { data, error } = await this.dbInstance!.from(
      "game_challenges_ongoing_view"
    ).select(
      "id,Game(gameName, id), requirements , startTime ,endTime ,type, name,reward, level"
    );
    if (error) this.throwError(error);
    this.logMethodResult("getAllOngoingChallenges", data);
    return data;
  };

  getCompletedChallenges: (
    gameId: string,
    userId: string
  ) => Promise<CompletedChallenges> = async (gameId, userId) => {
    this.logMethodCall("getCompletedChallenges", { gameId, userId });
    const { data, error } = await this.dbInstance!.from("completed_challenges")
      .select("id ,userId, challengeId, Game(gameName) , gameId ,level")
      .eq("userId", userId)
      .eq("gameId", gameId);
    if (error) this.throwError(error);
    this.logMethodResult("getCompletedChallenges", data);
    return data;
  };

  getAllCompletedChallenges: (userId: string) => Promise<CompletedChallenges> =
    async (userId) => {
      this.logMethodCall("getAllCompletedChallenges", { userId });
      const { data, error } = await this.dbInstance!.from(
        "completed_challenges"
      )
        .select(
          `
          id,
          userId,
          challengeId,
          gameId,
          Game (
            gameName
          ),
          game_challenges!challengeId (
            reward
          )
        `
        )
        .eq("userId", userId);
      if (error) this.throwError(error);
      this.logMethodResult("getAllCompletedChallenges", data);
      return data;
    };

  getCompletedChallengeById = async (id: string) => {
    this.logMethodCall("getCompletedChallengeById", { id });
    const { data, error } = await this.dbInstance!.from("completed_challenges")
      .select(
        "id ,userId, challengeId, game_challenges(name), Game(gameName) , gameId "
      )
      .eq("challengeId", id);
    if (error) this.throwError(error);
    this.logMethodResult("getCompletedChallengeById", data);
    return data;
  };

  updateChallengesCompleted: (
    completed: updateCompletedChallenges
  ) => Promise<any> = async (completed: updateCompletedChallenges) => {
    this.logMethodCall("updateChallengesCompleted", { completed });
    const { data, error } = await this.dbInstance!.from("completed_challenges")
      .insert(completed)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("updateChallengesCompleted", data);
    return data;
  };

  updateTotalCoins: (userId: string, coins: number) => Promise<any> = async (
    userId,
    coins
  ) => {
    this.logMethodCall("updateTotalCoins", { userId, coins });
    const { data, error } = await this.dbInstance!.from("User")
      .select("balance, lifetime_earnings")
      .eq("id", userId)
      .single();
    if (error) this.throwError(error);
    const totalCoins = data?.balance + coins;
    const totalLifetimeEarnings = data?.lifetime_earnings + coins;
    const res = await this.dbInstance!.from("User")
      .update({
        balance: totalCoins,
        lifetime_earnings: totalLifetimeEarnings,
        level: Math.floor(totalLifetimeEarnings / 600) + 1,
      })
      .eq("id", userId)
      .select()
      .single();
    if (res.error) this.throwError(res.error);
    this.logMethodResult("updateTotalCoins", res.data);
    return res.data;
  };

  getAllChallenges: () => Promise<OnGoingChallenges> = async () => {
    this.logMethodCall("getAllChallenges");
    const { data, error } = await this.dbInstance!.from(
      "game_challenges"
    ).select(
      "id,Game(gameName,id), requirements, startTime ,endTime ,type, name ,reward, level, archived"
    );
    if (error) this.throwError(error);
    this.logMethodResult("getAllChallenges", data);
    return data;
  };

  getEndedChallenges: (gameId: string) => Promise<OnGoingChallenges> = async (
    gameId
  ) => {
    this.logMethodCall("getEndedChallenges", { gameId });
    const { data, error } = await this.dbInstance!.from(
      "game_challenges_ended_view"
    )
      .select(
        "id,Game(gameName,id), requirements, startTime ,endTime ,type, name ,reward, level"
      )
      .eq("gameId", gameId);
    if (error) this.throwError(error);
    this.logMethodResult("getEndedChallenges", data);
    return data;
  };

  getAllEndedChallenges: () => Promise<OnGoingChallenges> = async () => {
    this.logMethodCall("getAllEndedChallenges");
    const { data, error } = await this.dbInstance!.from(
      "game_challenges_ended_view"
    ).select(
      "id,Game(gameName,id), requirements, startTime ,endTime ,type, name ,reward, level"
    );
    if (error) this.throwError(error);
    this.logMethodResult("getAllEndedChallenges", data);
    return data;
  };

  getMultipleChallengeProgress: (
    userId: string,
    challengeIds: string[],
    gameId: string
  ) => Promise<any> = async (userId, challengeIds, gameId) => {
    this.logMethodCall("getMultipleChallengeProgress", {
      userId,
      challengeIds,
      gameId,
    });

    // Determine which progress table to query based on gameId
    let progressTable = "";
    switch (gameId) {
      case "1": // Assuming 1 is Dota
        progressTable = "dota_progress";
        break;
      case "2": // Assuming 2 is Valorant
        progressTable = "vallorent_progress";
        break;
      case "3": // Assuming 3 is Fortnite
        progressTable = "fornite_progress";
        break;
      default:
        this.throwError("Invalid game ID");
    }

    const { data, error } = await this.dbInstance!.from(progressTable)
      .select("*")
      .eq("userId", userId)
      .in("challengeId", challengeIds);

    if (error) {
      this.throwError(error);
    }

    this.logMethodResult("getMultipleChallengeProgress", data);
    return data || [];
  };

  getChallengesGroupedByLevel: () => Promise<ChallengesGroupedByLevel> =
    async () => {
      this.logMethodCall("getChallengesGroupedByLevel");

      // Get all challenges with their level information
      const { data, error } = await this.dbInstance!.from(
        "game_challenges_ongoing_view"
      )
        .select(
          `
        id,
        reward,
        level
      `
        )
        .order("level", { ascending: true });

      if (error) this.throwError(error);

      // Group challenges by level and calculate total reward
      const groupedChallenges: ChallengesGroupedByLevel = {};

      if (data) {
        data.forEach((challenge: any) => {
          const level = challenge.level || 1; // Default to level 1 if not specified

          if (!groupedChallenges[level]) {
            groupedChallenges[level] = {
              totalReward: 0,
              challengeCount: 0,
            };
          }

          groupedChallenges[level].totalReward += challenge.reward || 0;
          groupedChallenges[level].challengeCount += 1;
        });
      }

      this.logMethodResult("getChallengesGroupedByLevel", groupedChallenges);
      return groupedChallenges;
    };

  archiveChallenge: (challengeId: string) => Promise<any> = async (
    challengeId
  ) => {
    this.logMethodCall("archiveChallenge", { challengeId });
    const { data, error } = await this.dbInstance!.from("game_challenges")
      .update({ archived: true })
      .eq("id", challengeId)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("archiveChallenge", data);
    return data;
  };

  unarchiveChallenge: (challengeId: string) => Promise<any> = async (
    challengeId
  ) => {
    this.logMethodCall("unarchiveChallenge", { challengeId });
    const { data, error } = await this.dbInstance!.from("game_challenges")
      .update({ archived: false })
      .eq("id", challengeId)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("unarchiveChallenge", data);
    return data;
  };
}

export const challengesDao = new ChallengesDao();
