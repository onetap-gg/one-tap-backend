"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redeemCoupons = void 0;
const InventoryDao_1 = require("../../Inventory/Dao/InventoryDao");
const MarkitDao_1 = require("../Dao/MarkitDao");
const redeemCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const couponId = req.body.couponId;
        const userId = req.body.userId;
        const data = yield MarkitDao_1.markitDao.deleteCoupon(couponId);
        const redeem = InventoryDao_1.inventoryDao.addToInventory(data, userId);
        res.status(200).json(redeem);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("Server Error");
    }
});
exports.redeemCoupons = redeemCoupons;
