"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirementFactory = void 0;
const fortniteRequirements_1 = require("../GameClass/fortniteRequirements");
const vallorentRequirements_1 = require("../GameClass/vallorentRequirements");
const dotaRequirements_1 = require("../GameClass/dotaRequirements");
const Constants_1 = require("../../Constants");
class RequirementFactory {
    getRequirement(game) {
        switch (game) {
            case Constants_1.GAME_ID.DOTA: {
                return dotaRequirements_1.dota;
            }
            case Constants_1.GAME_ID.FORTNITE: {
                return fortniteRequirements_1.fortnite;
            }
            case Constants_1.GAME_ID.VALORENT: {
                return vallorentRequirements_1.vallorent;
            }
        }
    }
}
exports.requirementFactory = new RequirementFactory();
