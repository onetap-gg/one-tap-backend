import { User, Session } from "@supabase/supabase-js";

export type UserData = {
  userName: any;
  lifetime_earnings: number;
  balance: number;
  globalRanking: number;
} | null;

export type UserProfileDataArray =
  | {
      User: {
        userName: any;
        suspended: any;
        deleted: any;
      }[];
      id: any;
      isFav: any;
      Game: {
        gameName: any;
        gameImage: any;
      }[];
      totalPlayingHours: any;
      gameWon: any;
      gameLoss: any;
      gameBalance: any;
    }[]
  | null;

export type IsPremiumUserType =
  | {
      premiumUser: any;
    }[]
  | null;
