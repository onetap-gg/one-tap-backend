export class GAME{
    static DOTA  = "DOTA";
    static VALORENT = "VALORENT";
    static CALL_OF_DUTY = "CALL_OF_DUTY";
    static PUBG = "PUBG" ;
    static FALL_GUYS ="FALL_GUYS";
    static FORTNITE = "FORTNITE";
}

 

export enum OVER_WOLF_IDS{
    VALORENT = 21640
}


export class NUMBER{
    static ONE = 1;
    static TWO = 2;
    static THREE = 3;
    static FOUR = 4; 
    static FIVE = 5;
    static SIX = 6;
}

export const OVER_WOLF_TO_GAME_ID_MAPPER = {
    VALORENT : {
        GameId : NUMBER.TWO,
        OverWolfId : OVER_WOLF_IDS.VALORENT
    }
}
 

export class GAME_ID {
    static DOTA = NUMBER.ONE ;
    static VALORENT = NUMBER.TWO
    static CALL_OF_DUTY = NUMBER.THREE
    static PUBG = NUMBER.FOUR
    static FALL_GUYS = NUMBER.FIVE
    static FORTNITE = NUMBER.SIX
}


