export type ChallengesInSameGame =  {
    id: any;
    Game: {
        gameName: any;
        id: any;
    }[];
    requirements: any;
    startTime: any;
    endTime: any;
    type: any;
    name: any;
    reward : number
}[] | null

export type ChallengesNotInSameGame = {
    id: any;
    Game: {
        gameName: any;
        id: any;
    }[];
    requirements: any;
    startTime: any;
    endTime: any;
    type: any;
    name: any;
    reward : number
}[] | null

export type OnGoingChallenges = {
    id: any;
    Game: {
        gameName: any;
    }[];
    requirements: any;
    startTime: any;
    endTime: any;
    type: any;
    name: any;
    reward : number
}[] | null

export type CompletedChallenges ={
    id: any;
    userId: any;
    challengeId: any;
    Game: {
        gameName: any;
    }[];
    gameId: any;
}[] | null