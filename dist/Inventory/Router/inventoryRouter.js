"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRouter = void 0;
const express_1 = require("express");
const allInventoryInfo_1 = require("../Controllers/allInventoryInfo");
exports.inventoryRouter = (0, express_1.Router)();
exports.inventoryRouter.get("/get-all-user-info/:userId", allInventoryInfo_1.allInventoryInfo);
exports.inventoryRouter.get("/", (req, res) => {
    res.status(200).json("ok");
});
