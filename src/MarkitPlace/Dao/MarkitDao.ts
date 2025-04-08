import { Dao } from "../../utils/Classes/Dao";

// For reading existing coupons
interface Coupon {
  id?: number;
  coupon_name: string;
  game_id: number;
  description: string;
  points_to_redeem: number;
  item_id: number;
  is_available: boolean;
}

// For creating new coupons
interface CreateCoupon {
  coupon_name: string;
  game_id: number;
  description: string;
  points_to_redeem: number;
  item_id: number;
  is_available: boolean;
}

interface IMarkit {
  getCoupons: () => Promise<any>;
  setCoupon: (coupon: CreateCoupon) => Promise<any>;
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

    // First get all available coupons with their Item details
    const { data: coupons, error } = await this.dbInstance!.from("marketplace")
      .select(
        `
        id,
        item_id,
        points_to_redeem,
        is_available,
        Item (
          itemName,
          itemType,
          itemValue,
          itemImage,
          gameId,
          extraDetails
        )
      `
      )
      .eq("is_available", true);

    if (error) this.throwError(error);
    if (!coupons) return [];

    // Group coupons by item_id and count available instances
    const groupedCoupons = coupons.reduce((acc: any, coupon: any) => {
      const itemId = coupon.item_id;

      if (!acc[itemId]) {
        acc[itemId] = {
          item_id: itemId,
          available_instances: 1,
          marketplace_ids: [coupon.id],
          points_to_redeem: coupon.points_to_redeem,
          ...coupon.Item,
        };
      } else {
        acc[itemId].available_instances += 1;
        acc[itemId].marketplace_ids.push(coupon.id);
      }

      return acc;
    }, {});

    const result = Object.values(groupedCoupons);

    this.logMethodResult("getCoupons", result);
    return result;
  };

  getCouponById: (couponId: string) => Promise<any> = async (couponId) => {
    this.logMethodCall("getCouponById", { couponId });
    const { data, error } = await this.dbInstance!.from("marketplace")
      .select()
      .eq("id", couponId);
    if (error) this.throwError(error);
    this.logMethodResult("getCouponById", data);
    return data;
  };

  deleteCoupon: (couponsId: string) => Promise<any> = async (couponId) => {
    this.logMethodCall("deleteCoupon", { couponId });
    const response = await this.dbInstance!.from("marketplace")
      .delete()
      .eq("id", couponId);
    if (response.status === 204) {
      this.logMethodResult("deleteCoupon", "Successfully deleted");
      return response;
    } else this.throwError("COUPON NOT FOUND");
  };

  setCoupon: (coupon: CreateCoupon) => Promise<any> = async (coupon) => {
    this.logMethodCall("setCoupon", { coupon });
    const { data, error } = await this.dbInstance!.from("marketplace")
      .insert({
        coupon_name: coupon.coupon_name,
        game_id: coupon.game_id,
        description: coupon.description,
        points_to_redeem: coupon.points_to_redeem,
        item_id: coupon.item_id,
        is_available: coupon.is_available,
      })
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

  getFirstAvailableInstance: (itemId: number) => Promise<any> = async (
    itemId
  ) => {
    this.logMethodCall("getFirstAvailableInstance", { itemId });
    const { data, error } = await this.dbInstance!.from("marketplace")
      .select("*")
      .eq("item_id", itemId)
      .eq("is_available", true)
      .limit(1)
      .single();

    if (error) this.throwError(error);
    this.logMethodResult("getFirstAvailableInstance", data);
    return data;
  };
}

export const markitDao = new MarkitDao();
