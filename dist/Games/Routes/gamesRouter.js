"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesRouter = void 0;
const express_1 = require("express");
const getAllGames_1 = require("../Controllers/getAllGames");
exports.gamesRouter = (0, express_1.Router)();
exports.gamesRouter.get("/all-data", getAllGames_1.getAllData);
