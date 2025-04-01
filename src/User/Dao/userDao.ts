import { Dao } from "../../utils/Classes/Dao";
import { UserData } from "../Types/types";
import { UserProfileDataArray } from "../Types/types";
import { IsPremiumUserType } from "../Types/types";

interface BasicData {
  userName: string;
  profilePicture: string;
  userCustomId: string;
  profileName: string;
  globalRanking: number;
  balance: Number;
  Auth: string;
  level: number;
  premiumUser: boolean;
}

interface DaoType {
  getUserBasicInfo: (userId: string) => Promise<UserData>;
  getUserBasicInfoAll: () => Promise<any>;
  updateUserBasicInfo: (userData: BasicData, authId: string) => Promise<any>;
  getUserProfileData: (userId: string) => Promise<UserProfileDataArray>;
  getIsUserPremium: (userId: string) => Promise<IsPremiumUserType>;
  getBalance: (userId: string) => Promise<Balance>;
  createUserProfile: (userData: BasicData) => Promise<any>;
  updateCredit: (userId: string) => Promise<any>;
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
    const { data, error } = await this.dbInstance!.from("User")
      .update({ balance: 10 })
      .eq("userId", userId);
    if (error) this.throwError(error);
    this.logMethodResult("updateCredit", data);
    return data;
  };
}

export const userDao = new UserDoa();
