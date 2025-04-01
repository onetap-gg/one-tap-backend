import { number } from "zod";
import { Dao } from "../../utils/Classes/Dao";
import { ChallengesInSameGame } from "../Types/types";
import { ChallengesNotInSameGame } from "../Types/types";
import { OnGoingChallenges } from "../Types/types";
import { CompletedChallenges } from "../Types/types";

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
  updateChallengesCompleted: (
    completed: updateCompletedChallenges
  ) => Promise<any>;
  updateTotalCoins: (userId: string, coins: number) => Promise<any>;
  getAllChallenges: () => Promise<OnGoingChallenges>;
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
    const { data, error } = await this.dbInstance!.from(
      "game_challenges_active_insamegame_view"
    )
      .select(
        "id, gameId, Game:gameId(gameName, id), requirements, startTime, endTime, type, name, reward"
      )
      .eq("gameId", gameId)
      .not(
        "id",
        "in",
        this.dbInstance!.from("completed_challenges")
          .select("challengeId")
          .eq("gameId", gameId)
          .eq("userId", userId)
      );

    if (error) this.throwError(error);
    this.logMethodResult("getNonCompletedChallengesInSameGame", data);
    return data || [];
  };

  getNonCompletedChallengesNotInSameGame: (
    gameId: string,
    userId: string
  ) => Promise<any> = async (gameId, userId) => {
    this.logMethodCall("getNonCompletedChallengesNotInSameGame", {
      gameId,
      userId,
    });
    const { data, error } = await this.dbInstance!.from(
      "game_challenges_active_insamegame_view"
    )
      .select(
        "id, gameId, Game:gameId(gameName, id), requirements, startTime, endTime, type, name, reward"
      )
      .eq("gameId", gameId)
      .not(
        "id",
        "in",
        this.dbInstance!.from("completed_challenges")
          .select("challengeId")
          .eq("gameId", gameId)
          .eq("userId", userId)
      );

    if (error) this.throwError(error);
    this.logMethodResult("getNonCompletedChallengesNotInSameGame", data);
    return data || [];
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
      "id,Game(gameName), requirements , startTime ,endTime ,type, name,reward, level"
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
          "id ,userId, challengeId, game_challenges(name, reward), Game(gameName) , gameId, level"
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
      .select("balance")
      .eq("id", userId)
      .single();
    if (error) this.throwError(error);
    const totalCoins = data?.balance + coins;
    const res = await this.dbInstance!.from("User")
      .update({ balance: totalCoins })
      .eq("id", userId)
      .select()
      .single();
    if (res.error) this.throwError(res.error);
    this.logMethodResult("updateTotalCoins", res.data.balance);
    return res.data.balance;
  };

  getAllChallenges: () => Promise<OnGoingChallenges> = async () => {
    this.logMethodCall("getAllChallenges");
    const { data, error } = await this.dbInstance!.from(
      "game_challenges"
    ).select(
      "id,Game(gameName,id), requirements, startTime ,endTime ,type, name ,reward, level"
    );
    if (error) this.throwError(error);
    this.logMethodResult("getAllChallenges", data);
    return data;
  };
}

export const challengesDao = new ChallengesDao();
