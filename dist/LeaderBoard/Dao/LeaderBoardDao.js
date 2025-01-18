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
exports.leaderBoarDao = void 0;
const Dao_1 = require("../../utils/Classes/Dao");
class LeaderBoardDao extends Dao_1.Dao {
    constructor() {
        super();
        this.getAllData = () => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance
                .from("UserGame")
                .select(`id, User(userName),gameBalance , gameLevel , Game(gameName)`)
                .order('gameBalance', { ascending: false });
            if (error)
                this.throwError(error);
            return data;
        });
        this.getGameSpecificData = (gameId) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance
                .from("UserGame")
                .select(`id, User(userName),gameBalance , gameLevel , Game(gameName)`)
                .eq(`gameId`, gameId)
                .order('gameBalance', { ascending: false });
            if (error)
                this.throwError(error);
            return data;
        });
        if (this.dbInstance === null)
            this.throwError("DB instance is not present");
    }
}
exports.leaderBoarDao = new LeaderBoardDao();
