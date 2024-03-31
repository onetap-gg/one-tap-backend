import { Dao } from "../../utils/Classes/Dao";

interface IMarkit {
    getCoupons : () => Promise<any> 
    setCoupon : (couponId: string) => Promise<any>
    deleteCoupon : (coupon:any) => Promise<any>
}

class MarkitDao extends Dao implements IMarkit {
    constructor(){
        super()
        if(this.dbInstance === null) this.throwError("DB instance is not present");
    }

    getCoupons: () => Promise<any> = async () => {
        const {data , error} = await this.dbInstance!.from("markitplace").select("id")
        if(error) this.throwError(error)
        return data ;
    }

    deleteCoupon: (couponsId: string) => Promise<any> = async (couponId) =>{
        const {data , error} = await this.dbInstance!.from("markitplace").select(`id , coupon_id`).eq("id" , couponId)
        if(error) this.throwError(error) 
        const response = await this.dbInstance!.from("markitplace")
            .delete()
            .eq("coupon_id" , couponId)
            .select()
        if(response) this.throwError(response)
        if(data)
            return data
        else this.throwError("COUPON NOT FOUND")
    }

    setCoupon: (coupon: any) => Promise<any> = async (coupon)=>{
        const {data , error} = await this.dbInstance!.from("markitplace").insert({...coupon}).select()
        return data;
    }     
}

export const markitDao = new MarkitDao ()