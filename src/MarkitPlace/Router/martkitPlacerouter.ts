import { Router } from "express";

import { getCoupons } from "../Controller/getCoupons";
import { setCoupon } from "../Controller/setCoupons";
import { redeemCoupons } from "../Controller/redeemCoupons";

export const markitPlaceRouter = Router()

markitPlaceRouter.post("/set-coupons",setCoupon)

markitPlaceRouter.get("/get-coupons",getCoupons)

markitPlaceRouter.post("/redeem-coupons",redeemCoupons)