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
    this.logMethodCall("getCoupons");
    const { data, error } = await this.dbInstance!.from("marketplace").select();
    if (error) this.throwError(error);
    this.logMethodResult("getCoupons", data);
    return data;
  };

  getCouponById: (couponId: string) => Promise<any> = async (couponId) => {
    this.logMethodCall("getCouponById", { couponId });
    const { data, error } = await this.dbInstance!.from("marketplace")
      .select()
      .eq("coupon_id", couponId);
    if (error) this.throwError(error);
    this.logMethodResult("getCouponById", data);
    return data;
  };

  deleteCoupon: (couponsId: string) => Promise<any> = async (couponId) => {
    this.logMethodCall("deleteCoupon", { couponId });
    const response = await this.dbInstance!.from("marketplace")
      .delete()
      .eq("coupon_id", couponId);
    if (response.status === 204) {
      this.logMethodResult("deleteCoupon", "Successfully deleted");
      return response;
    } else this.throwError("COUPON NOT FOUND");
  };

  setCoupon: (coupon: Coupon) => Promise<any> = async (coupon) => {
    this.logMethodCall("setCoupon", { coupon });
    const { data, error } = await this.dbInstance!.from("marketplace")
      .insert({ ...coupon })
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("setCoupon", data);
    return data;
  };

  editCoupon: (coupon: Coupon, id: number) => Promise<any> = async (
    coupon,
    id
  ) => {
    this.logMethodCall("editCoupon", { coupon, id });
    const { data, error } = await this.dbInstance!.from("marketplace")
      .update({ ...coupon })
      .eq("id", id)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("editCoupon", data);
    return data;
  };

  couponCountByGame: () => Promise<any> = async () => {
    this.logMethodCall("couponCountByGame");
    const { data, error } = await this.dbInstance!.rpc(
      "count_coupons_per_game"
    );

    if (error) {
      this.throwError(error);
      return;
    }

    this.logMethodResult("couponCountByGame", data);
    return data;
  };
}

export const markitDao = new MarkitDao();
