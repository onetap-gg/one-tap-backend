import { Controller } from "../../utils/interfaces/controller"
import { inventoryDao } from "../Dao/InventoryDao"
export const allInventoryInfo : Controller = async (req,res)=>{
    const userId:string = req.params.userId!.toString()
    try{
        const coinsSpend = await inventoryDao.getCoinsSpend(userId)
        const coinsEarned = await inventoryDao.getCoinsEarned(userId)
        const purchaseHistory = await inventoryDao.getPurchaseHistory(userId)

        const response =  {coinsSpend , coinsEarned ,purchaseHistory};
        res.status(200).send(response)
    }catch(err){
        console.log(err)
        res.status(500).json("server error")
    }
}