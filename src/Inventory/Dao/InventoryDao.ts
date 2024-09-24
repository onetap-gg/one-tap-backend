import { Dao } from "../../utils/Classes/Dao"
import { GetAllCoinEarnedType } from "../Types/types"
import { GetAllCoinsSpendType } from "../Types/types"
import { PurchaseHistoryType } from "../Types/types"

interface DaoType {
    getCoinsEarned : (userId : string)=> Promise<GetAllCoinEarnedType>
    getCoinsSpend : (userId : string) => Promise <GetAllCoinsSpendType>
    getPurchaseHistory : (userId : string) => Promise <PurchaseHistoryType>
    addToInventory : (coupon :any,userId:string) => Promise <any> 
}

class InventoryDao extends Dao implements DaoType{
    
    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }

    getCoinsEarned: (userId : string) => Promise<GetAllCoinEarnedType> = async (userId)=>{
        const {data ,error} = await this.dbInstance!
        .from('UserGame')
        .select(` id,Game(gameName) , gameBalance`)
        .eq(`userId`, userId)
        if(error) this.throwError(error)
        return data;
    }
    
    getCoinsSpend: (userId: string) => Promise<GetAllCoinsSpendType> = async (userId) =>{
        const {data,error} = await this.dbInstance!
        .from(`UserGame`)
        .select(`id , Game(gameName,gameImage) , coinsSpend`)
        .eq(`userId`,userId)
        if(error) this.throwError(error)
        return data
    }
        
    getPurchaseHistory: (userId: string) => Promise<PurchaseHistoryType> = async (userId) => {
        const {data , error} = await this.dbInstance!
        .from(`UserPurchases`)
        .select(`id , createdAt ,amount , Item(itemName ,itemImage , itemType , Game(gameName))`)
        .eq(`userId`,userId)
        if(error) this.throwError(error)
        return data
    }

    addToInventory : (coupon: any,userId:string) => Promise<any> = async (coupon , userId) =>{
        const {data , error} = await this.dbInstance!.from("UserPurchases").insert({userId, ...coupon}).select()
        if(error) this.throwError(error)
        return data;
    }

}
export const inventoryDao = new InventoryDao()