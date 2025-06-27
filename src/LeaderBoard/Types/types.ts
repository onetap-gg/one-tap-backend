export type LeaderBoardDataArray =
  | {
      id: string;
      userName: string;
      lifetime_earnings: number;
      UserGame: {
        Game: {
          gameName: string;
        }[];
      }[];
    }[]
  | null;

export type LeaderBoardData = {
  User: {
    userName: string;
  };
  lifetime_earnings: number;
  Game: {
    gameName: string;
  };
} | null;

export type LeaderBoarGameWiseType =
  | {
      id: string;
      userName: string;
      lifetime_earnings: number;
      UserGame: {
        Game: {
          gameName: string;
        }[];
      }[];
      rank: number;
    }[]
  | null;
