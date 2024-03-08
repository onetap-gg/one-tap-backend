import { User ,Session} from "@supabase/supabase-js";

export type UserData ={
    userName: any;
}[] | null

export type UserProfileDataArray =  {
    User: {
        userName: any;
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
}[] | null

export type IsPremiumUserType =
    {
        premiumUser: any;
    }[] | null