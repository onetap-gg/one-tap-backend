"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderBoardRouter = void 0;
const express_1 = require("express");
const getAllData_1 = require("../Controllers/getAllData");
const getGameSpecificData_1 = require("../Controllers/getGameSpecificData");
exports.leaderBoardRouter = (0, express_1.Router)();
exports.leaderBoardRouter.get("/all-data", getAllData_1.getAllData);
exports.leaderBoardRouter.get("/game-specific/:gameId", getGameSpecificData_1.getGameSpecificData);
