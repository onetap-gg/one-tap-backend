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
exports.updateProfileInfoController = void 0;
const userDao_1 = require("../Dao/userDao");
const updateProfileInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authId } = req.params;
        const userData = req.body.data;
        const data = yield userDao_1.userDao.checkUserExists(authId);
        const countResponse = yield userDao_1.userDao.countUserId();
        console.log("count", countResponse);
        console.log(JSON.stringify(userData));
        let response;
        if (data.length === 0) {
            console.log("creating profile");
            userData["Auth"] = authId;
            userData["id"] = countResponse + 1;
            response = yield userDao_1.userDao.createUserProfile(userData);
        }
        else {
            console.log("updating profile");
            response = yield userDao_1.userDao.updateUserBasicInfo(userData, authId);
        }
        console.log(response);
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
exports.updateProfileInfoController = updateProfileInfoController;
