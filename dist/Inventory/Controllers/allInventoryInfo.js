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
exports.allInventoryInfo = void 0;
const InventoryDao_1 = require("../Dao/InventoryDao");
const allInventoryInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId.toString();
    try {
        const coinsSpend = yield InventoryDao_1.inventoryDao.getCoinsSpend(userId);
        const coinsEarned = yield InventoryDao_1.inventoryDao.getCoinsEarned(userId);
        const purchaseHistory = yield InventoryDao_1.inventoryDao.getPurchaseHistory(userId);
        const response = { coinsSpend, coinsEarned, purchaseHistory };
        res.status(200).send(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("server error");
    }
});
exports.allInventoryInfo = allInventoryInfo;
