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
exports.fortnite = void 0;
const Dao_1 = require("../../Classes/Dao");
class Fortnite extends Dao_1.Dao {
    constructor() {
        super();
        this.uploadChallenges = (data) => __awaiter(this, void 0, void 0, function* () {
            const res = yield this.dbInstance.from("game_challenges").insert([...data]);
            if (res.error)
                this.throwError(res.error);
            return;
        });
        if (this.dbInstance === null)
            this.throwError("DB instance is not present");
    }
    checkIfReqMeet(userAchievement, goals) {
        let achieved = 0;
        if (userAchievement.health >= goals.health) {
            achieved++;
        }
        if (userAchievement.knockout >= goals.knockout) {
            achieved++;
        }
        if (userAchievement.revived >= goals.revived) {
            achieved++;
        }
        if (userAchievement.kills >= goals.kills) {
            achieved++;
        }
        if (userAchievement.shield >= goals.shield) {
            achieved++;
        }
        if (userAchievement.total_shots >= goals.total_shots) {
            achieved++;
        }
        let total = 0;
        let player = 0;
        player = userAchievement.health + userAchievement.knockout + userAchievement.revived + userAchievement.kills + userAchievement.shield + userAchievement.total_shots;
        total = goals.health + goals.knockout + goals.revived + goals.kills + goals.shield + goals.total_shots;
        const percentage = (player / total) * 100;
        let isCompleted = false;
        if (achieved === 6)
            isCompleted = true;
        return { isCompleted, percentage };
    }
    getDataUptoDate(start, end, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getDataUptoDate", start, end, userId);
            const { data, error } = yield this.dbInstance.from("fortnite_data").select(`id , match_start,match_end,kills,knockout,revived,health,total_shots ,shield,userId ,mode ,match_status`)
                .gte("match_start", start)
                .lte("match_end", end)
                .eq("userId", userId);
            if (error)
                this.throwError(error);
            return data;
        });
    }
    updateMatchDetails(matchData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("fortnite_data").insert(Object.assign(Object.assign({}, matchData), { userId })).select();
            if (error)
                this.throwError(error);
            return data;
        });
    }
    calculateTotal(matches, challenge) {
        const status = challenge.match_status;
        const total = { match_status: status, match_start: "", match_end: "", id: 0, userId: "", kills: 0, knockout: 0, revived: 0, health: 0, total_shots: 0, shield: 0, mode: "" };
        matches.forEach((match) => {
            total.health += match.health;
            total.kills += match.kills;
            total.knockout += match.knockout;
            total.revived += match.revived;
            total.shield += match.shield;
            total.total_shots += match.total_shots;
        });
        return total;
    }
    uploadProgress(progress) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("dota_progress").insert([...progress]).select();
            if (error)
                this.throwError(error);
            return data;
        });
    }
    upsertProgress(progress) {
        return __awaiter(this, void 0, void 0, function* () {
            const challengeIdArray = [];
            const progressMp = new Map();
            console.log("progress", progress);
            progress.forEach((pr) => {
                const id = pr.challengeId;
                progressMp.set(id, pr);
                challengeIdArray.push(id.toString());
            });
            let res, data, error;
            console.log("challengeArray", progressMp);
            if (challengeIdArray.length > 0) {
                res = yield this.dbInstance.from("vallorent_progress").select("id , challengeId ,userId , requirement").in("challengeId", challengeIdArray);
                data = res.data;
                error = res.error;
                if (error)
                    this.throwError(error);
            }
            const updateArray = [];
            const insertArray = [];
            const deleteArray = [];
            if (data) {
                data.forEach((dt) => {
                    const id = dt.challengeId;
                    const found = progressMp.get(id);
                    console.log("found", found);
                    if (found) {
                        if (found.isCompleted) {
                            deleteArray.push(dt.id);
                        }
                        else {
                            updateArray.push(Object.assign(Object.assign({}, dt), { requirement: found.requirement }));
                        }
                        progressMp.delete(id);
                    }
                });
            }
            progressMp.forEach((val, key) => {
                if (!val.isCompleted) {
                    const requirement = val.requirement;
                    const challengeId = val.challengeId;
                    const userId = val.userId;
                    insertArray.push({ requirement, challengeId, userId });
                }
            });
            let update, insert, del;
            console.log("hey there what a sudden surprise ", challengeIdArray, deleteArray, insertArray, updateArray);
            if (updateArray.length > 0)
                update = this.dbInstance.from("vallorent_progress").upsert([...updateArray]).select();
            if (insertArray.length > 0)
                insert = this.dbInstance.from("vallorent_progress").insert([...insertArray]).select();
            if (deleteArray.length > 0)
                del = this.dbInstance.from("vallorent_progress").delete().in("id", deleteArray);
            const promiseArray = [];
            if (updateArray.length)
                promiseArray.push(update);
            if (insertArray.length)
                promiseArray.push(insert);
            if (deleteArray.length)
                promiseArray.push(del);
            const resp = yield Promise.all(promiseArray);
            const updatedProgress = [];
            resp.forEach((res, i) => {
                if (res.error)
                    this.throwError(res.error);
                if (i != 2)
                    updatedProgress.push(res.data);
            });
            return updatedProgress;
        });
    }
    getProgressData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("fornite_progress").select("*");
            if (error)
                this.throwError(error);
            return data;
        });
    }
}
exports.fortnite = new Fortnite();
