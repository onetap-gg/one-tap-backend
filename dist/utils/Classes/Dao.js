"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dao = void 0;
const DB_1 = require("../../db/DB");
class Dao extends DB_1.DB {
    constructor() {
        super();
        this.throwError = (error) => {
            if (typeof error === "string")
                throw new Error(error);
            else
                throw new Error(JSON.stringify(error));
        };
    }
}
exports.Dao = Dao;
