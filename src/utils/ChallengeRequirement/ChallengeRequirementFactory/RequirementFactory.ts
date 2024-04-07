import { fortnite } from "../GameClass/fortniteRequirements";
import { vallorent } from "../GameClass/vallorentRequirements";
import { dota } from "../GameClass/dotaRequirements";

import { GAME_ID } from "../../Constants";

class RequirementFactory{
    getRequirement(game:number){
        switch(game){
            case GAME_ID.DOTA :{
                return dota
            }
            case GAME_ID.FORTNITE :{
                return fortnite
            }
            case GAME_ID.VALORENT :{
                return vallorent
            }
        }
    }
}

export const requirementFactory = new RequirementFactory()

