import { Router } from "express";

import { getCoupons } from "../Controller/getCoupons";
import { setCoupon } from "../Controller/setCoupons";
import { redeemCoupons } from "../Controller/redeemCoupons";
import { deleteCoupon } from "../Controller/deleteCoupons";
import { editCoupon } from "../Controller/editCoupon";
import { countCouponByName } from "../Controller/countCouponByName";
import { getItems } from "../Controller/getItems";
import { editItem } from "../Controller/editItem";
import { archiveItem } from "../Controller/archiveItem";
import { unarchiveItem } from "../Controller/unarchiveItem";

export const markitPlaceRouter = Router();

// Coupon routes
markitPlaceRouter.post("/set-coupons", setCoupon);
markitPlaceRouter.get("/get-coupons", getCoupons);
markitPlaceRouter.post("/edit-coupon/:id", editCoupon);
markitPlaceRouter.post("/redeem-coupons", redeemCoupons);
markitPlaceRouter.get("/coupon-count-by-game", countCouponByName);

// Item routes
markitPlaceRouter.get("/get-items", getItems);
markitPlaceRouter.post("/edit-item/:id", editItem);
markitPlaceRouter.get("/items/:itemId/archive", archiveItem);
markitPlaceRouter.get("/items/:itemId/unarchive", unarchiveItem);
