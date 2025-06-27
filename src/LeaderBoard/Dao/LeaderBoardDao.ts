import { Dao } from "../../utils/Classes/Dao";
import { LeaderBoardDataArray } from "../Types/types";
import { LeaderBoarGameWiseType } from "../Types/types";

interface DaoType {
  getAllData: () => Promise<LeaderBoardDataArray>;
  getGameSpecificData: (gameId: string) => Promise<LeaderBoarGameWiseType>;
}

class LeaderBoardDao extends Dao implements DaoType {
  constructor() {
    super();
    if (this.dbInstance === null) this.throwError("DB instance is not present");
  }

  getAllData: () => Promise<LeaderBoardDataArray> = async () => {
    this.logMethodCall("getAllData");
    // First get all users ordered by lifetime earnings
    const { data, error } = await this.dbInstance!.from("User")
      .select(`id, userName, lifetime_earnings, UserGame(Game(gameName))`)
      .order("lifetime_earnings", { ascending: false });
    if (error) this.throwError(error);

    // Update globalRanking for each user based on their position
    const updatePromises = data?.map(async (user, index) => {
      const { error: updateError } = await this.dbInstance!.from("User")
        .update({ globalRanking: index + 1 })
        .eq("id", user.id);
      if (updateError) this.throwError(updateError);
    });

    // Wait for all ranking updates to complete
    if (updatePromises) {
      await Promise.all(updatePromises);
    }

    this.logMethodResult("getAllData", data);
    return data;
  };

  getGameSpecificData: (gameId: string) => Promise<LeaderBoarGameWiseType> =
    async (gameId) => {
      this.logMethodCall("getGameSpecificData", { gameId });
      // Get completed challenges for the specific game and sum up their rewards
      const { data, error } = await this.dbInstance!.from(
        "completed_challenges"
      )
        .select(
          `
          userId,
          User!completed_challenges_userId_fkey!inner(
            id,
            userName
          ),
          gameId,
          Game!inner(gameName),
          game_challenges!inner!challengeId(reward)
        `
        )
        .eq("gameId", gameId);

      if (error) this.throwError(error);

      // Group by userId and sum up rewards
      const userRewards = new Map();
      data?.forEach((challenge: any) => {
        const userId = challenge.userId;
        const reward = challenge.game_challenges?.reward || 0;
        if (!userRewards.has(userId)) {
          userRewards.set(userId, {
            id: challenge.User.id,
            userName: challenge.User.userName,
            lifetime_earnings: reward,
            UserGame: [
              {
                Game: [
                  {
                    gameName: challenge.Game.gameName,
                  },
                ],
              },
            ],
          });
        } else {
          const existing = userRewards.get(userId);
          userRewards.set(userId, {
            ...existing,
            lifetime_earnings: existing.lifetime_earnings + reward,
          });
        }
      });

      // Convert to array and sort by total rewards
      const rankedData = Array.from(userRewards.values())
        .sort((a, b) => b.lifetime_earnings - a.lifetime_earnings)
        .map((user, index) => ({
          ...user,
          rank: index + 1,
        }));

      this.logMethodResult("getGameSpecificData", rankedData);
      return rankedData;
    };
}

export const leaderBoarDao = new LeaderBoardDao();
