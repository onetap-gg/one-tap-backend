import { Router } from "express";

import { getCoupons } from "../Controller/getCoupons";
import { setCoupon } from "../Controller/setCoupons";
import { redeemCoupons } from "../Controller/redeemCoupons";
import { deleteCoupon } from "../Controller/deleteCoupons";
import { editCoupon } from "../Controller/editCoupon";

export const markitPlaceRouter = Router();

markitPlaceRouter.post("/set-coupons", setCoupon);

markitPlaceRouter.get("/get-coupons", getCoupons);

markitPlaceRouter.get("/delete-coupon/:couponId", deleteCoupon);

markitPlaceRouter.post("/edit-coupon/:id", editCoupon);

markitPlaceRouter.post("/redeem-coupons", redeemCoupons);
