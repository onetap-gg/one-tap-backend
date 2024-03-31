import { Controller } from "../../utils/interfaces/controller"

import { markitDao } from "../Dao/MarkitDao"

export const setCoupon :Controller = async (req,res) =>{
    try{
        const coupons = req.body.coupons
        const data = await markitDao.setCoupon(coupons)
        res.status(200).json(data)
    }catch(err:any){
        console.log(err)
        res.status(500).json("Server Error")
    }    
}