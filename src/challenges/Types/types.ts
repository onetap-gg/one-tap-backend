export type ChallengesInSameGame = {
    id: any;
    Game: {
        gameName: any;
    }[];
    Challanges: {
        requirements: any;
    }[];
    startTime: any;
    endTime: any;
    type: any;
    name: any;
}[] | null

export type ChallengesNotInSameGame = {
    id: any;
    Game: {
        gameName: any;
    }[];
    Challanges: {
        requirements: any;
    }[];
    startTime: any;
    endTime: any;
    type: any;
    name: any;
}[] | null

export type OnGoingChallenges = {
    id: any;
    Game: {
        gameName: any;
    }[];
    Challanges: {
        requirements: any;
    }[];
    startTime: any;
    endTime: any;
    type: any;
    name: any;
}[] | null

export type CompletedChallenges = {
    id: any;
    userId: any;
    game_challenges: {
        Game: {
            gameName: any;
        }[];
        startTime: any;
        endTime: any;
        type: any;
        name: any;
        Challanges: {
            requirements: any;
        }[];
    }[];
}[] | null