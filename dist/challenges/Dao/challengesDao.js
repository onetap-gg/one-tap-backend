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
exports.challengesDao = void 0;
const Dao_1 = require("../../utils/Classes/Dao");
class ChallengesDao extends Dao_1.Dao {
    constructor() {
        super();
        this.getChallengesInSameGame = (gameId) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("game_challenges_active_insamegame_view")
                .select("id,Game(gameName,id), requirements , startTime ,endTime ,type, name , reward")
                .eq("gameId", gameId);
            if (error)
                this.throwError(error);
            return data;
        });
        this.getChallengesNotInSameGame = (gameId) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("game_challenges_active_not_insamegame_view")
                .select("id,Game(gameName,id), requirements, startTime ,endTime ,type, name ,reward")
                .eq("gameId", gameId);
            if (error)
                this.throwError(error);
            return data;
        });
        this.getOngoingChallenges = (gameId) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("game_challenges_ongoing_view")
                .select("id,Game(gameName), requirements , startTime ,endTime ,type, name,reward")
                .eq("gameId", gameId);
            if (error)
                this.throwError(error);
            return data;
        });
        this.getCompletedChallenges = (gameId, userId) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("completed_challenges")
                .select("id ,userId, challengeId, Game(gameName) , gameId ")
                .eq("userId", userId)
                .eq("gameId", gameId);
            if (error)
                this.throwError(error);
            return data;
        });
        this.getCompletedChallengeById = (id) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("completed_challenges")
                .select("id ,userId, challengeId, game_challenges(name), Game(gameName) , gameId ")
                .eq("challengeId", id);
            if (error)
                this.throwError(error);
            return data;
        });
        this.updateChallengesCompleted = (completed) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("completed_challenges")
                .insert(completed)
                .select();
            if (error)
                this.throwError(error);
            return data;
        });
        this.updateTotalCoins = (userId, coins) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("User")
                .select("balance")
                .eq("id", userId)
                .single();
            if (error)
                this.throwError(error);
            const totalCoins = (data === null || data === void 0 ? void 0 : data.balance) + coins;
            const res = yield this.dbInstance.from("User")
                .update({ balance: totalCoins })
                .eq("id", userId)
                .select()
                .single();
            if (res.error)
                this.throwError(res.error);
            return res.data.balance;
        });
        if (this.dbInstance === null)
            this.throwError("DB instance is not present");
    }
}
exports.challengesDao = new ChallengesDao();
