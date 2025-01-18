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
exports.editCoupon = void 0;
const MarkitDao_1 = require("../Dao/MarkitDao");
const editCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = req.body;
    const id = req.params.id;
    try {
        const data = yield MarkitDao_1.markitDao.editCoupon(coupon, id);
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("server error");
    }
});
exports.editCoupon = editCoupon;
