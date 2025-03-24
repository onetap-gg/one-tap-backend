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
exports.profileInfoController = void 0;
const userDao_1 = require("../Dao/userDao");
const profileInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const data = yield userDao_1.userDao.getUserProfileData(userId);
        const coins = yield userDao_1.userDao.getBalance(userId);
        const x = coins / 100;
        const level = Math.pow(x, 0.8);
        res.status(200).json(Object.assign(Object.assign({}, data), { level }));
    }
    catch (err) {
        console.log(err);
        res.status(500).json("server error");
    }
});
exports.profileInfoController = profileInfoController;
