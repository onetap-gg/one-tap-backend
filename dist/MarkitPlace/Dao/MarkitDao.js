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
exports.markitDao = void 0;
const Dao_1 = require("../../utils/Classes/Dao");
class MarkitDao extends Dao_1.Dao {
    constructor() {
        super();
        this.getCoupons = () => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("marketplace").select();
            if (error)
                this.throwError(error);
            return data;
        });
        this.deleteCoupon = (couponId) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.dbInstance.from("marketplace")
                .delete()
                .eq("coupon_id", couponId);
            if (response.status === 204)
                return response;
            else
                this.throwError("COUPON NOT FOUND");
        });
        this.setCoupon = (coupon) => __awaiter(this, void 0, void 0, function* () {
            console.log(coupon);
            const { data, error } = yield this.dbInstance.from("marketplace")
                .insert(Object.assign({}, coupon))
                .select();
            if (error)
                this.throwError(error);
            return data;
        });
        this.editCoupon = (coupon, id) => __awaiter(this, void 0, void 0, function* () {
            console.log(coupon);
            const { data, error } = yield this.dbInstance.from("marketplace")
                .update(Object.assign({}, coupon))
                .eq("id", id)
                .select();
            if (error)
                this.throwError(error);
            return data;
        });
        if (this.dbInstance === null)
            this.throwError("DB instance is not present");
    }
}
exports.markitDao = new MarkitDao();
