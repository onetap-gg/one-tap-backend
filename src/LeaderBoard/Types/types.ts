
export type LeaderBoardDataArray = {
    id: any;
    User: {
        userName: any;
    }[];
    gameBalance: any;
    gameLevel: any;
    Game: {
        gameName: any;
    }[];
}[] | null

export type LeaderBoardData = {
    User: {
        userName: any;
    };
    balance: any;
    gameLevel: any;
    Game: {
        gameName: any;
    }
}| null

export type LeaderBoarGameWiseType ={
    id: any;
    User: {
        userName: any;
    }[];
    gameBalance: any;
    gameLevel: any;
    Game: {
        gameName: any;
    }[];
}[] | null