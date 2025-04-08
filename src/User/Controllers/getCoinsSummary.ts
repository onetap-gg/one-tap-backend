import { Controller } from "../../utils/interfaces/controller";
import { userDao } from "../Dao/userDao";
import { challengesDao } from "../../challenges/Dao/challengesDao";
import { inventoryDao } from "../../Inventory/Dao/InventoryDao";

export const getCoinsSummary: Controller = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    // Get daily rewards data
    const dailyRewardsData = await userDao.getLastRewardTimestamp(userId);

    // Get all completed challenges
    const completedChallenges = await challengesDao.getAllCompletedChallenges(
      userId
    );

    // Get purchase history for coupons
    const purchaseHistory = await inventoryDao.getPurchaseHistory(userId);

    // Group challenges by gameId and calculate total rewards
    const challengesByGame: { [key: string]: { total_rewards: number } } = {};

    if (completedChallenges) {
      completedChallenges.forEach((challenge: any) => {
        const gameId = challenge.gameId;
        if (!challengesByGame[gameId]) {
          challengesByGame[gameId] = { total_rewards: 0 };
        }
        // Add the reward from the challenge
        if (challenge.game_challenges && challenge.game_challenges.reward) {
          challengesByGame[gameId].total_rewards +=
            challenge.game_challenges.reward;
        }
      });
    }

    // Filter purchases to only include coupons
    const couponPurchases =
      purchaseHistory?.filter(
        (purchase: any) => purchase.Item && purchase.Item.itemType === "COUPON"
      ) || [];

    const response = {
      coins_earned: [
        {
          challenges: challengesByGame,
          daily_rewards: {
            streak: dailyRewardsData?.current_streak || 0,
            lastCollected: dailyRewardsData?.last_reward_collected || null,
          },
        },
      ],
      coins_spent: couponPurchases.map((purchase: any) => ({
        itemName: purchase.Item?.itemName,
        cost: purchase.amount,
        purchasedAt: purchase.createdAt,
        gameId: purchase.Item?.gameId || null,
      })),
    };

    console.log(response as unknown as string);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getCoinsSummary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
