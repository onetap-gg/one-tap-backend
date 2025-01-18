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
exports.dota = void 0;
const Dao_1 = require("../../Classes/Dao");
class Dota extends Dao_1.Dao {
    constructor() {
        super();
        this.uploadChallenges = (data) => __awaiter(this, void 0, void 0, function* () {
            const res = yield this.dbInstance.from("game_challenges").insert([...data]);
            if (res.error)
                this.throwError(res.error);
        });
        if (this.dbInstance === null)
            this.throwError("DB instance is not present");
    }
    checkIfReqMeet(userAchievement, goals) {
        let achieved = 0;
        if (userAchievement.assists >= goals.assists) {
            achieved++;
        }
        if (userAchievement.creep_score >= goals.creep_score) {
            achieved++;
        }
        if (userAchievement.death >= goals.death) {
            achieved++;
        }
        if (userAchievement.kills >= goals.kills) {
            achieved++;
        }
        if (userAchievement.physical_damage_dealt_players >= goals.physical_damage_dealt_players) {
            achieved++;
        }
        let total = 0;
        let player = 0;
        total = goals.assists + goals.creep_score + goals.death + goals.kills + goals.physical_damage_dealt_players;
        player = userAchievement.assists + userAchievement.creep_score + userAchievement.death + userAchievement.kills + userAchievement.physical_damage_dealt_players;
        let percentage = (player / total) * 100;
        let isCompleted = false;
        if (achieved === 5)
            isCompleted = true;
        return { isCompleted, percentage };
    }
    updateMatchDetails(matchData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("dota_data").insert(Object.assign(Object.assign({}, matchData), { userId })).select();
            if (error)
                this.throwError(error);
            return data;
        });
    }
    ;
    getDataUptoDate(start, end, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("dota_data").select(`id, 
        match_start,
        match_end, 
        kills, 
        assists,
        death, 
        creep_score, 
        physical_damage_dealt_players,
        Auth,
        match_status
        `)
                .gte("match_start", start)
                .lte("match_end", end)
                .eq("Auth", userId);
            if (error)
                this.throwError(error);
            return data;
        });
    }
    calculateTotal(matches, challenge) {
        const status = challenge.match_status;
        const total = { match_status: status, match_start: "", match_end: "", id: 0, Auth: "", kills: 0, assists: 0, death: 0, creep_score: 0, physical_damage_dealt_players: 0 };
        matches.forEach(match => {
            total.assists += match.assists;
            total.kills += match.kills;
            total.creep_score += match.creep_score;
            total.death += match.death;
            total.physical_damage_dealt_players += match.physical_damage_dealt_players;
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
                res = yield this.dbInstance.from("vallorent_progress").select("id , challengeId ,Auth , requirement").in("challengeId", challengeIdArray);
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
                            updateArray.push(Object.assign(Object.assign({}, dt), { requirement: found.requirement, userId: dt.Auth }));
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
            const { data, error } = yield this.dbInstance.from("dota_progress").select("*");
            if (error)
                this.throwError(error);
            return data;
        });
    }
}
exports.dota = new Dota();
