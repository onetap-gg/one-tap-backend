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
exports.vallorent = void 0;
const Dao_1 = require("../../Classes/Dao");
class Vallorent extends Dao_1.Dao {
    constructor() {
        super();
        this.uploadChallenges = (data) => __awaiter(this, void 0, void 0, function* () {
            const res = yield this.dbInstance.from("game_challenges").insert([
                ...data,
            ]);
            if (res.error)
                this.throwError(res.error);
        });
        if (this.dbInstance === null)
            this.throwError("DB instance is not present");
    }
    checkIfReqMeet(userAchievement, goal) {
        console.log("--------------------checking if challenge is completed------------------");
        console.log("user achievement", userAchievement);
        console.log("goal", goal);
        if (userAchievement === null)
            this.throwError("Null object");
        let achieved = 0;
        if (userAchievement.assists >= goal.assists) {
            achieved++;
            console.log(1);
        }
        if (userAchievement.damage_done >= goal.damage_done) {
            achieved++;
            console.log(2);
        }
        if (userAchievement.damage_taken != null &&
            userAchievement.damage_taken >= goal.damage_taken) {
            achieved++;
            console.log(3);
        }
        if (userAchievement.deaths >= goal.deaths) {
            achieved++;
            console.log(4);
        }
        if (userAchievement.headshot >= goal.headshot) {
            achieved++;
            console.log(5);
        }
        if (userAchievement.spikes_defuse >= goal.spikes_defuse) {
            achieved++;
            console.log(6);
        }
        if (userAchievement.spikes_planted >= goal.spikes_planted) {
            achieved++;
            console.log(7);
        }
        if (userAchievement.team_scores >= goal.team_scores) {
            achieved++;
            console.log(8);
        }
        if (userAchievement.total_kills >= goal.total_kills) {
            achieved++;
            console.log(9);
        }
        let total = 0;
        let player = 0;
        console.log("amount of match property", achieved);
        total =
            goal.assists +
                goal.damage_done +
                goal.damage_taken +
                goal.deaths +
                goal.headshot +
                goal.spikes_defuse +
                goal.spikes_planted +
                goal.team_scores +
                goal.total_kills;
        player =
            userAchievement.assists +
                userAchievement.damage_done +
                userAchievement.damage_taken +
                userAchievement.deaths +
                userAchievement.headshot +
                userAchievement.spikes_defuse +
                userAchievement.spikes_planted +
                userAchievement.team_scores +
                userAchievement.total_kills;
        console.log("player", player);
        console.log("total", total);
        let percentage = (player / total) * 100;
        let isCompleted = false;
        if (achieved === 9)
            isCompleted = true;
        console.log("is completed", isCompleted);
        console.log("percentage", percentage);
        console.log("------------------------------------------------------------");
        return { isCompleted, percentage };
    }
    updateMatchDetails(matchData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("valorent_data")
                .insert(Object.assign(Object.assign({}, matchData), { userId }))
                .select();
            if (error)
                this.throwError(error);
            return data;
        });
    }
    getDataUptoDate(start, end, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("hello", start, end, userId);
            const { data, error } = yield this.dbInstance.from("valorent_data")
                .select(`id , match_start ,match_end ,total_kills , deaths ,assists ,headshot , spikes_planted ,spikes_defuse , damage_done ,team_scores ,   match_status , agent, region ,game_mode ,damage_taken,userId`)
                .gte("match_start", start)
                .lte("match_end", end)
                .eq("userId", userId);
            if (error)
                this.throwError(error);
            console.log("getDataUptoDate", data);
            return data;
        });
    }
    calculateTotal(matches, challenge) {
        console.log("----------------------calculateTotal------------------------");
        console.log();
        const status = challenge.match_status;
        const total = {
            id: 0,
            match_start: "",
            match_end: "",
            total_kills: 0,
            deaths: 0,
            assists: 0,
            headshot: 0,
            spikes_planted: 0,
            spikes_defuse: 0,
            damage_done: 0,
            team_scores: 0,
            match_status: status,
            agent: "",
            region: "",
            game_mode: "",
            damage_taken: 0,
            userId: "",
        };
        matches.forEach((match) => {
            total.assists += match.assists;
            total.damage_done += match.damage_done;
            total.damage_taken += match.damage_taken;
            total.deaths += match.deaths;
            total.headshot += match.headshot;
            total.spikes_defuse += match.spikes_defuse;
            total.spikes_planted += match.spikes_planted;
            total.team_scores += match.team_scores;
            total.total_kills += match.total_kills;
        });
        return total;
    }
    uploadProgress(progress) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("progress", progress);
            const { data, error } = yield this.dbInstance.from("vallorent_progress")
                .insert([...progress])
                .select();
            if (error)
                this.throwError(error);
            return data;
        });
    }
    upsertProgress(progress) {
        return __awaiter(this, void 0, void 0, function* () {
            const challengeIdArray = [];
            const progressMp = new Map();
            console.log("progress from upsert progress", progress);
            progress.forEach((pr) => {
                const id = pr.challengeId;
                progressMp.set(id, pr);
                challengeIdArray.push(id.toString());
            });
            let res, data, error;
            console.log("challengeArray", progressMp);
            if (challengeIdArray.length > 0) {
                res = yield this.dbInstance.from("vallorent_progress")
                    .select("id , challengeId ,userId , requirement")
                    .in("challengeId", challengeIdArray);
                data = res.data;
                error = res.error;
                if (error)
                    this.throwError(error);
            }
            const updateArray = [];
            const insertArray = [];
            const deleteArray = [];
            if (data) {
                console.log("data from vallorent_progress: ", data);
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
                update = this.dbInstance.from("vallorent_progress")
                    .upsert([...updateArray])
                    .select();
            if (insertArray.length > 0)
                insert = this.dbInstance.from("vallorent_progress")
                    .insert([...insertArray])
                    .select();
            if (deleteArray.length > 0)
                del = this.dbInstance.from("vallorent_progress")
                    .delete()
                    .in("id", deleteArray);
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
            const { data, error } = yield this.dbInstance.from("vallorent_progress").select("*");
            if (error)
                this.throwError(error);
            return data;
        });
    }
}
exports.vallorent = new Vallorent();
