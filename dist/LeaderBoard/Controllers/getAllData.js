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
exports.getAllData = void 0;
const GameDao_1 = require("../../Games/Dao/GameDao");
const LeaderBoardDao_1 = require("../Dao/LeaderBoardDao");
const getAllData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let rank = 0;
        const data = yield LeaderBoardDao_1.leaderBoarDao.getAllData();
        const games = yield GameDao_1.gameDao.getAllGame();
        const rankWiseFilteredData = [];
        games.map(game => {
            let gameName = game.gameName;
            let rank = 0;
            const groupByGameName = data.filter(dt => {
                let userGameObject = dt.Game;
                const userGame = userGameObject.gameName;
                if (gameName === userGame) {
                    rank++;
                    return Object.assign({ rank }, dt);
                }
            });
            rankWiseFilteredData.push(...groupByGameName);
        });
        res.status(200).json(rankWiseFilteredData);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("Server Error");
    }
});
exports.getAllData = getAllData;
