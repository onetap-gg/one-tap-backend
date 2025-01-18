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
exports.getProgress = void 0;
const RequirementFactory_1 = require("../../utils/ChallengeRequirement/ChallengeRequirementFactory/RequirementFactory");
const getProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const gameId = Number(req.params.gameId);
        const game = RequirementFactory_1.requirementFactory.getRequirement(gameId);
        const progress = yield game.getProgressData(userId);
        res.status(200).json(progress);
    }
    catch (err) {
        console.log(err);
        res.status(500).json('server Error');
    }
    res.status(200).json();
});
exports.getProgress = getProgress;
