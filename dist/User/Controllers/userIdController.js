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
exports.getUserIdController = void 0;
const getUserIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authId = req.params.authId; // Adjust according to how you're passing `authId`
    try {
        // const userId = await userDao.getUserId(authId);
        res.status(200).json({});
    }
    catch (error) {
        console.error(error);
        // Send a more generic message to the client
        res.status(500).json({ message: "Server error" });
    }
});
exports.getUserIdController = getUserIdController;
