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
exports.gameDao = void 0;
const Dao_1 = require("../../utils/Classes/Dao");
class GameDao extends Dao_1.Dao {
    constructor() {
        super(...arguments);
        this.getAllGame = () => __awaiter(this, void 0, void 0, function* () {
            if (this.dbInstance === null)
                this.throwError("DB instance is not present");
            const { data, error } = yield this.dbInstance
                .from("Game")
                .select(`gameName,gameImage`);
            if (error)
                this.throwError(error);
            return data;
        });
    }
}
exports.gameDao = new GameDao();
