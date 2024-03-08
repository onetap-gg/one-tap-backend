export type GetAllCoinEarnedType ={
    id: any;
    Game: {
        gameName: any;
    }[];
    gameBalance: any;
}[] | null

export type GetAllCoinsSpendType ={
    id: any;
    Game: {
        gameName: any;
        gameImage: any;
    }[];
    coinsSpend: any;
}[] | null

export type PurchaseHistoryType ={
    id: any;
    createdAt: any;
    amount: any;
    Item: {
        itemName: any;
        itemImage: any;
        itemType: any;
        Game: {
            gameName: any;
        }[];
    }[];
}[] | null