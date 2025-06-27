export type GetAllCoinEarnedType =
  | {
      id: string;
      Game: {
        gameName: string;
      }[];
      gameBalance: number;
    }[]
  | null;

export type GetAllCoinsSpendType =
  | {
      id: string;
      Game: {
        gameName: string;
        gameImage: string;
      }[];
      coinsSpend: number;
    }[]
  | null;

export type PurchaseHistoryType =
  | {
      id: string;
      createdAt: string;
      amount: number;
      Item: {
        itemName: string;
        itemType: string;
        itemValue: string | null;
        gameId: number;
        extraDetails: any | null;
      }[];
    }[]
  | null;

export type TransactionSource = {
  type: "CHALLENGE" | "DAILY_REWARD" | "PURCHASE";
  gameName?: string;
  gameImage?: string;
  itemName?: string;
  itemType?: string;
  itemValue?: string | null;
  itemImage?: string | null;
  gameId?: number;
  extraDetails?: any | null;
};

export type TransactionHistoryItem = {
  id: string;
  amount: number;
  timestamp: string;
  transactionType: "EARNED" | "SPENT";
  source: TransactionSource;
};

export type GameChallenges = {
  gameName: string;
  gameImage: string;
  totalEarned: number;
  transactions: TransactionHistoryItem[];
};

export type GameWiseEarnings = {
  gameId: number;
  totalEarned: number;
  transactions: TransactionHistoryItem[];
};

export type TransactionHistoryResponse = {
  earned: {
    challenges: {
      byGame: GameWiseEarnings[];
      total: number;
    };
    dailyRewards: {
      transactions: TransactionHistoryItem[];
      total: number;
    };
    total: number;
  };
  purchases: TransactionHistoryItem[];
  totalSpent: number;
};

export type TransactionType = "EARN" | "SPEND";

export type Transaction = {
  id?: string;
  userId: string;
  amount: number;
  type: TransactionType;
  source: "DAILY_REWARD" | "CHALLENGE" | "COUPON";
  sourceId?: string | null;
};
