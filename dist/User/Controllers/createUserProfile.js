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
exports.createProfileController = void 0;
const userDao_1 = require("../Dao/userDao");
const createProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body.data;
    const authId = req.params;
    userData["Auth"] = authId;
    const { data, error } = yield userDao_1.userDao.createUserProfile(userData);
    console.log(data, error);
    if (!error) {
        res.status(200).json(data);
    }
    else {
        res.status(500).json(error);
    }
});
exports.createProfileController = createProfileController;
