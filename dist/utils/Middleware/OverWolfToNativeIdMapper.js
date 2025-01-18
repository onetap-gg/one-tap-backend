"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverWolfIdToNativeMapper = void 0;
const Constants_1 = require("../Constants");
const OverWolfIdToNativeMapper = (req, res, next) => {
    let gameId = null;
    if (req.params.userId)
        gameId = Number(req.params.gameId);
    if (req.body.gameId)
        gameId = req.body.gameId;
    console.log("overwolf id", gameId);
    Object.entries(Constants_1.OVER_WOLF_TO_GAME_ID_MAPPER).forEach(([key, value]) => {
        if (gameId && value.OverWolfId === gameId) {
            gameId = value.GameId;
        }
    });
    if (gameId) {
        if (req.params.gameId)
            req.params.gameId = gameId.toString();
        if (req.body.gameId)
            req.body.gameId = gameId.toString();
    }
    console.log("Native user id", gameId);
    next();
};
exports.OverWolfIdToNativeMapper = OverWolfIdToNativeMapper;
