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
exports.userDao = void 0;
const Dao_1 = require("../../utils/Classes/Dao");
class UserDoa extends Dao_1.Dao {
    constructor() {
        super();
        this.getUserBasicInfo = (authId) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("User")
                .select()
                .eq("Auth", authId)
                .single();
            console.log(data, error);
            if (error)
                this.throwError(error);
            return data;
        });
        this.getUserBasicInfoAll = () => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("User").select();
            console.log(data, error);
            if (error)
                this.throwError(error);
            return data;
        });
        this.getUserProfileData = (userId) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("UserGame")
                .select(`
            User(userName),
            id,
            isFav,
            Game(gameName ,gameImage),
            totalPlayingHours,
            gameWon,
            gameLoss,
            gameBalance
        `)
                .eq(`userId`, userId);
            if (error)
                this.throwError(error);
            return data;
        });
        this.getIsUserPremium = (userId) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("User")
                .select(`premiumUser`)
                .eq(`userId`, userId);
            if (error)
                this.throwError(error);
            return data;
        });
        this.getBalance = (userId) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("User")
                .select(`balance`)
                .eq(`userId`, userId);
            if (error)
                this.throwError(error);
            return data;
        });
        this.createUserProfile = (userData) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("User")
                .insert(userData)
                .select();
            console.log(data, error);
            if (error)
                this.throwError(error);
            return data;
        });
        this.updateUserBasicInfo = (userData, authId) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("User")
                .update(userData)
                .eq("Auth", authId);
            console.log(data, error);
            if (error)
                this.throwError(error);
            return data;
        });
        this.checkUserExists = (authId) => __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield this.dbInstance.from("User")
                .select()
                .eq("Auth", authId);
            console.log(data, error);
            if (error)
                this.throwError(error);
            return data;
        });
        this.countUserId = () => __awaiter(this, void 0, void 0, function* () {
            const { count, error } = yield this.dbInstance.from("User").select("*", {
                count: "exact",
                head: true,
            });
            console.log(count, error);
            return count;
        });
        if (this.dbInstance === null)
            this.throwError("DB instance is not present");
    }
}
exports.userDao = new UserDoa();
