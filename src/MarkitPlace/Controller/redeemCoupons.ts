import { Controller } from "../../utils/interfaces/controller"
import { inventoryDao } from "../../Inventory/Dao/InventoryDao"
import { markitDao } from "../Dao/MarkitDao"

export const redeemCoupons:Controller = async (req,res) =>{
    try{
        const couponId = req.body.couponId
        const userId = req.body.userId
        const data = await markitDao.deleteCoupon(couponId)
        const redeem =  inventoryDao.addToInventory(data , userId)
        res.status(200).json(redeem)
        
    }catch(err:any){
        console.log(err)
        res.status(500).json("Server Error")
    }    
}