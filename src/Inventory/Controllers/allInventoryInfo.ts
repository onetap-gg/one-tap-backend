import { Controller } from "../../utils/interfaces/controller"
import { inventoryDao } from "../Dao/InventoryDao"
export const allInventoryInfo : Controller = async (req,res)=>{
    const authId:string = req.params.authId!.toString()
    try{
        const coinsSpend = await inventoryDao.getCoinsSpend(authId)
        const coinsEarned = await inventoryDao.getCoinsEarned(authId)
        const purchaseHistory = await inventoryDao.getPurchaseHistory(authId)

        const response =  {coinsSpend , coinsEarned ,purchaseHistory};
        res.status(200).send(response)
    }catch(err){
        console.log(err)
        res.status(500).json("server error")
    }
}