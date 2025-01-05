import { Dao } from "../../utils/Classes/Dao";

interface IMarkit {
  getCoupons: () => Promise<any>;
  setCoupon: (coupon: Coupon) => Promise<any>;
  deleteCoupon: (coupon: any) => Promise<any>;
  editCoupon: (coupon: Coupon, id: number) => Promise<any>;
}

class MarkitDao extends Dao implements IMarkit {
  constructor() {
    super();
    if (this.dbInstance === null) this.throwError("DB instance is not present");
  }

  getCoupons: () => Promise<any> = async () => {
    const { data, error } = await this.dbInstance!.from("marketplace").select();
    if (error) this.throwError(error);
    return data;
  };

  deleteCoupon: (couponsId: string) => Promise<any> = async (couponId) => {
    const response = await this.dbInstance!.from("marketplace")
      .delete()
      .eq("coupon_id", couponId);
    if (response.status === 204) return response;
    else this.throwError("COUPON NOT FOUND");
  };

  setCoupon: (coupon: Coupon) => Promise<any> = async (coupon) => {
    console.log(coupon);
    const { data, error } = await this.dbInstance!.from("marketplace")
      .insert({ ...coupon })
      .select();
    if (error) this.throwError(error);
    return data;
  };

  editCoupon: (coupon: Coupon, id: number) => Promise<any> = async (
    coupon,
    id
  ) => {
    console.log(coupon);
    const { data, error } = await this.dbInstance!.from("marketplace")
      .update({ ...coupon })
      .eq("id", id)
      .select();
    if (error) this.throwError(error);
    return data;
  };
}

export const markitDao = new MarkitDao();
