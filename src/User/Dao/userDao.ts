import { Dao } from "../../utils/Classes/Dao";
import { UserData } from "../Types/types";
import { UserProfileDataArray } from "../Types/types";
import {IsPremiumUserType} from "../Types/types"

interface DaoType {
    getUserBasicInfo :  (userId : string)=> Promise<UserData>;
    getUserProfileData : (userId : string) => Promise<UserProfileDataArray>;
    getIsUserPremium : (userId : string) => Promise<IsPremiumUserType>
}

class UserDoa extends Dao implements DaoType{
    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }

    getUserBasicInfo: (userId: string) => Promise<UserData> = async (userId) =>{
        const {data ,error} = await this.dbInstance!
            .from('User')
            .select()
            .eq('id',userId)
            .single()

        if(error) this.throwError(error)
        return data
    }

    getUserProfileData: (userId: string) => Promise<UserProfileDataArray> = async (userId) =>{
        const {data ,error} =await this.dbInstance!.from('UserGame').select(`
            User(userName),
            id,
            isFav,
            Game(gameName ,gameImage),
            totalPlayingHours,
            gameWon,
            gameLoss,
            gameBalance
        `).eq(`User.id`, userId)
        if(error) this.throwError(error)
        return data
    }

    getIsUserPremium : (userId : string) => Promise<IsPremiumUserType> = async (userId) =>{
        const {data , error} = await this.dbInstance!.from('user').select(`premiumUser`).eq(`userId` , userId)
        if(error) this.throwError(error)
        return data
    }
}

export const userDao = new UserDoa()