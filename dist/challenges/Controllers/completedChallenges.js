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
exports.completedChallenges = void 0;
const challengesDao_1 = require("../Dao/challengesDao");
const completedChallenges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const gameId = req.params.gameId;
        const challenges = yield challengesDao_1.challengesDao.getCompletedChallenges(gameId, userId);
        res.status(200).json(challenges);
    }
    catch (err) {
        console.log(err);
        res.status(500).json('server Error');
    }
    res.status(200).json();
});
exports.completedChallenges = completedChallenges;
