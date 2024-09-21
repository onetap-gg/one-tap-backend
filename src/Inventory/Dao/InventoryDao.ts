import { Dao } from "../../utils/Classes/Dao"
import { GetAllCoinEarnedType } from "../Types/types"
import { GetAllCoinsSpendType } from "../Types/types"
import { PurchaseHistoryType } from "../Types/types"

interface DaoType {
    getCoinsEarned : (authId : string)=> Promise<GetAllCoinEarnedType>
    getCoinsSpend : (authId : string) => Promise <GetAllCoinsSpendType>
    getPurchaseHistory : (authId : string) => Promise <PurchaseHistoryType>
    addToInventory : (coupon :any,authId:string) => Promise <any> 
}

class InventoryDao extends Dao implements DaoType{
    
    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }

    getCoinsEarned: (authId : string) => Promise<GetAllCoinEarnedType> = async (authId)=>{
        const {data ,error} = await this.dbInstance!
        .from('UserGame')
        .select(` id,Game(gameName) , gameBalance`)
        .eq(`Auth`, authId)
        if(error) this.throwError(error)
        return data;
    }
    
    getCoinsSpend: (authId: string) => Promise<GetAllCoinsSpendType> = async (authId) =>{
        const {data,error} = await this.dbInstance!
        .from(`UserGame`)
        .select(`id , Game(gameName,gameImage) , coinsSpend`)
        .eq(`Auth`,authId)
        if(error) this.throwError(error)
        return data
    }
        
    getPurchaseHistory: (authId: string) => Promise<PurchaseHistoryType> = async (authId) => {
        const {data , error} = await this.dbInstance!
        .from(`UserPurchases`)
        .select(`id , createdAt ,amount , Item(itemName ,itemImage , itemType , Game(gameName))`)
        .eq(`Auth`,authId)
        if(error) this.throwError(error)
        return data
    }

    addToInventory : (coupon: any,authId:string) => Promise<any> = async (coupon , authId) =>{
        const {data , error} = await this.dbInstance!.from("UserPurchases").insert({authId, ...coupon}).select()
        if(error) this.throwError(error)
        return data;
    }

}
export const inventoryDao = new InventoryDao()