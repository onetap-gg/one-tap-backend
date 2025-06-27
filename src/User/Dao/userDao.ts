import { Dao } from "../../utils/Classes/Dao";
import { UserData } from "../Types/types";
import { UserProfileDataArray } from "../Types/types";
import { IsPremiumUserType } from "../Types/types";
import { transactionDao } from "../../Inventory/Dao/TransactionDao";

interface BasicData {
  userName: string;
  profilePicture: string;
  userCustomId: string;
  profileName: string;
  globalRanking: number;
  balance: Number;
  lifetime_earnings: number;
  Auth: string;
  level: number;
  premiumUser: boolean;
}

interface DaoType {
  getUserBasicInfo: (userId: string) => Promise<UserData>;
  getUserBasicInfoById: (userId: string) => Promise<UserData>;
  getUserBasicInfoAll: () => Promise<any>;
  updateUserBasicInfo: (userData: BasicData, authId: string) => Promise<any>;
  getUserProfileData: (userId: string) => Promise<UserProfileDataArray>;
  getIsUserPremium: (userId: string) => Promise<IsPremiumUserType>;
  getBalance: (userId: string) => Promise<Balance>;
  createUserProfile: (userData: BasicData) => Promise<any>;
  updateCredit: (userId: string) => Promise<any>;
  checkAndUpdateDailyReward: (userId: string) => Promise<any>;
  getLastRewardTimestamp: (userId: string) => Promise<any>;
  updateBalance: (userId: string, newBalance: number) => Promise<any>;
  updateUserLevel: (userId: string, lifetimeEarnings: number) => Promise<any>;
  suspendUser: (authId: string) => Promise<any>;
  deleteUser: (authId: string) => Promise<any>;
}

export type Balance =
  | {
      balance: any;
    }[]
  | null;

class UserDoa extends Dao implements DaoType {
  constructor() {
    super();
    if (this.dbInstance === null) this.throwError("DB instance is not present");
  }

  getUserBasicInfo: (authId: string) => Promise<UserData> = async (authId) => {
    this.logMethodCall("getUserBasicInfo", { authId });
    const { data, error } = await this.dbInstance!.from("User")
      .select()
      .eq("Auth", authId)
      .single();

    if (error) this.throwError(error);
    this.logMethodResult("getUserBasicInfo", data);
    return data;
  };

  getUserBasicInfoById: (userId: string) => Promise<UserData> = async (
    userId
  ) => {
    this.logMethodCall("getUserBasicInfoById", { userId });
    const { data, error } = await this.dbInstance!.from("User")
      .select()
      .eq("id", userId)
      .single();

    if (error) this.throwError(error);
    this.logMethodResult("getUserBasicInfoById", data);
    return data;
  };

  getUserBasicInfoAll: () => Promise<any> = async () => {
    this.logMethodCall("getUserBasicInfoAll");
    const { data, error } = await this.dbInstance!.from("User").select();

    if (error) this.throwError(error);
    this.logMethodResult("getUserBasicInfoAll", data);
    return data;
  };

  getUserProfileData: (userId: string) => Promise<UserProfileDataArray> =
    async (userId) => {
      this.logMethodCall("getUserProfileData", { userId });
      const { data, error } = await this.dbInstance!.from("UserGame")
        .select(
          `
            User(userName, suspended, deleted),
            id,
            isFav,
            Game(gameName ,gameImage),
            totalPlayingHours,
            gameWon,
            gameLoss,
            gameBalance
        `
        )
        .eq(`userId`, userId);
      if (error) this.throwError(error);
      this.logMethodResult("getUserProfileData", data);
      return data;
    };

  getIsUserPremium: (userId: string) => Promise<IsPremiumUserType> = async (
    userId
  ) => {
    this.logMethodCall("getIsUserPremium", { userId });
    const { data, error } = await this.dbInstance!.from("User")
      .select(`premiumUser`)
      .eq(`userId`, userId);
    if (error) this.throwError(error);
    this.logMethodResult("getIsUserPremium", data);
    return data;
  };

  getBalance: (userId: string) => Promise<any> = async (userId) => {
    this.logMethodCall("getBalance", { userId });
    const { data, error } = await this.dbInstance!.from("User")
      .select(`balance`)
      .eq(`userId`, userId);
    if (error) this.throwError(error);
    this.logMethodResult("getBalance", data);
    return data;
  };

  createUserProfile: (userData: BasicData) => Promise<any> = async (
    userData: BasicData
  ) => {
    this.logMethodCall("createUserProfile", { userData });
    const { data, error } = await this.dbInstance!.from("User")
      .insert(userData)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("createUserProfile", data);
    return data;
  };

  updateUserBasicInfo: (userData: BasicData, userId: string) => Promise<any> =
    async (userData: BasicData, authId: string) => {
      this.logMethodCall("updateUserBasicInfo", { userData, authId });
      const { data, error } = await this.dbInstance!.from("User")
        .update(userData)
        .eq("Auth", authId);
      if (error) this.throwError(error);
      this.logMethodResult("updateUserBasicInfo", data);
      return data;
    };

  checkUserExists: (authId: string) => Promise<any> = async (
    authId: string
  ) => {
    this.logMethodCall("checkUserExists", { authId });
    const { data, error } = await this.dbInstance!.from("User")
      .select()
      .eq("Auth", authId);
    if (error) this.throwError(error);
    this.logMethodResult("checkUserExists", data);
    return data;
  };

  countUserId: () => Promise<any> = async () => {
    this.logMethodCall("countUserId");
    const { count, error } = await this.dbInstance!.from("User").select("*", {
      count: "exact",
      head: true,
    });
    if (error) this.throwError(error);
    this.logMethodResult("countUserId", count);
    return count;
  };

  updateCredit: (userId: string) => Promise<any> = async (userId: string) => {
    this.logMethodCall("updateCredit", { userId });
    const { data: userData, error: fetchError } = await this.dbInstance!.from(
      "User"
    )
      .select("balance, lifetime_earnings")
      .eq("id", userId)
      .single();

    if (fetchError) this.throwError(fetchError);
    if (!userData) this.throwError("User not found");

    const CREDIT_AMOUNT = 10;
    const { data, error } = await this.dbInstance!.from("User")
      .update({
        balance:
          (userData as NonNullable<typeof userData>).balance + CREDIT_AMOUNT,
        lifetime_earnings:
          (userData as NonNullable<typeof userData>).lifetime_earnings +
          CREDIT_AMOUNT,
        level:
          Math.floor(
            ((userData as NonNullable<typeof userData>).lifetime_earnings +
              CREDIT_AMOUNT) /
              600
          ) + 1,
      })
      .eq("id", userId)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("updateCredit", data);
    return data;
  };

  checkAndUpdateDailyReward: (userId: string) => Promise<any> = async (
    userId: string
  ) => {
    this.logMethodCall("checkAndUpdateDailyReward", { userId });

    // First get the user's current data
    const { data: userData, error: fetchError } = await this.dbInstance!.from(
      "User"
    )
      .select(
        "last_reward_collected, balance, lifetime_earnings, current_streak"
      )
      .eq("id", userId)
      .single();

    if (fetchError) this.throwError(fetchError);
    if (!userData) return null;

    const now = new Date();
    const lastRewardDate = userData.last_reward_collected
      ? new Date(userData.last_reward_collected)
      : null;

    // Helper function to check if two dates are the same calendar day
    const isSameDay = (date1: Date, date2: Date) => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };

    // Helper function to check if two dates are consecutive calendar days
    const isConsecutiveDay = (current: Date, previous: Date) => {
      const prevDay = new Date(previous);
      prevDay.setDate(prevDay.getDate() + 1);
      return isSameDay(current, prevDay);
    };

    // If last reward was collected today, return null
    if (lastRewardDate && isSameDay(now, lastRewardDate)) {
      this.logMethodResult("checkAndUpdateDailyReward", null);
      return null;
    }

    // Calculate new streak
    const newStreak = lastRewardDate
      ? isConsecutiveDay(now, lastRewardDate)
        ? (userData.current_streak || 0) + 1
        : 1
      : 1;

    const DAILY_REWARD = 10;

    // Update balance, lifetime_earnings, last_reward_collected, and current_streak
    const { data, error } = await this.dbInstance!.from("User")
      .update({
        balance: userData.balance + DAILY_REWARD,
        lifetime_earnings: userData.lifetime_earnings + DAILY_REWARD,
        last_reward_collected: now.toISOString(),
        current_streak: newStreak,
        level:
          Math.floor((userData.lifetime_earnings + DAILY_REWARD) / 600) + 1,
      })
      .eq("id", userId)
      .select();

    if (error) this.throwError(error);

    // Record the transaction after successful balance update
    await transactionDao.recordTransaction({
      userId,
      amount: DAILY_REWARD,
      type: "EARN",
      source: "DAILY_REWARD",
      sourceId: null,
    });

    this.logMethodResult("checkAndUpdateDailyReward", data);
    return data;
  };

  getLastRewardTimestamp: (userId: string) => Promise<any> = async (
    userId: string
  ) => {
    this.logMethodCall("getLastRewardTimestamp", { userId });
    const { data, error } = await this.dbInstance!.from("User")
      .select("last_reward_collected, current_streak")
      .eq("id", userId)
      .single();

    if (error) this.throwError(error);
    this.logMethodResult("getLastRewardTimestamp", data);
    return data;
  };

  updateBalance: (userId: string, newBalance: number) => Promise<any> = async (
    userId: string,
    newBalance: number
  ) => {
    this.logMethodCall("updateBalance", { userId, newBalance });
    const { data, error } = await this.dbInstance!.from("User")
      .update({ balance: newBalance })
      .eq("id", userId)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("updateBalance", data);
    return data;
  };

  updateUserLevel: (userId: string, lifetimeEarnings: number) => Promise<any> =
    async (userId: string, lifetimeEarnings: number) => {
      this.logMethodCall("updateUserLevel", { userId, lifetimeEarnings });
      const newLevel = Math.floor(lifetimeEarnings / 600) + 1;
      const { data, error } = await this.dbInstance!.from("User")
        .update({ level: newLevel })
        .eq("id", userId)
        .select();
      if (error) this.throwError(error);
      this.logMethodResult("updateUserLevel", data);
      return data;
    };

  suspendUser: (authId: string) => Promise<any> = async (authId: string) => {
    this.logMethodCall("suspendUser", { authId });
    const { data, error } = await this.dbInstance!.from("User")
      .update({ suspended: true })
      .eq("Auth", authId)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("suspendUser", data);
    return data;
  };

  deleteUser: (authId: string) => Promise<any> = async (authId: string) => {
    this.logMethodCall("deleteUser", { authId });
    const { data, error } = await this.dbInstance!.from("User")
      .update({ deleted: true })
      .eq("Auth", authId)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("deleteUser", data);
    return data;
  };

  unsuspendUser: (authId: string) => Promise<any> = async (authId: string) => {
    this.logMethodCall("unsuspendUser", { authId });
    const { data, error } = await this.dbInstance!.from("User")
      .update({ suspended: false })
      .eq("Auth", authId)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("unsuspendUser", data);
    return data;
  }

  

  checkUserSuspension: (authId: string) => Promise<any> = async (
    authId: string
  ) => {
    this.logMethodCall("checkUserSuspension", { authId });
    const { data, error } = await this.dbInstance!.from("User")
      .select("suspended")
      .eq("Auth", authId)
      .single();
    if (error) this.throwError(error);
    this.logMethodResult("checkUserSuspension", data);
    return data;
  };

  checkUserDeletion: (authId: string) => Promise<any> = async (
    authId: string
  ) => {
    this.logMethodCall("checkUserDeletion", { authId });
    const { data, error } = await this.dbInstance!.from("User")
      .select("deleted")
      .eq("Auth", authId)
      .single();
    if (error) this.throwError(error);
    this.logMethodResult("checkUserDeletion", data);
    return data;
  };
}

export const userDao = new UserDoa();
