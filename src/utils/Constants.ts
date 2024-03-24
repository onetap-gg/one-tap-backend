class GAME{
    static DOTA  = "DOTA";
    static VALORENT = "VALORENT";
    static CALL_OF_DUTY = "CALL_OF_DUTY";
    static PUBG = "PUBG" ;
    static FALL_GUYS ="FALL_GUYS";
    static FORTNITE = "FORTNITE";
}

class NUMBER{
    static ONE = "1";
    static TWO = "2";
    static THREE = "3";
    static FOUR = "4"; 
    static FIVE = "5";
    static SIX = "6";
}

class GAME_ID {
    static DOTA = NUMBER.ONE ;
    static VALORENT = NUMBER.TWO
    static CALL_OF_DUTY = NUMBER.THREE
    static PUBG = NUMBER.FOUR
    static FALL_GUYS = NUMBER.FIVE
    static FORTNITE = NUMBER.SIX
}


class CHECK_PROP_NAME_VALID{
 
    static DOTA = (property:string) :boolean=>{
        switch(property){
            case "kills": return true;
            case "assists": return true;
            case "death": return true;
            case "creep_score": return true;
            case "physical_damage_dealt_players": return true;
            case "physical_damage_dealt_champion": return true;
            case "physical_damage_taken": return true;
            case "true_damage_dealt_players": return true;
            case "true_damage_dealt_champion": return true;
            case "true_damage_taken": return true;
        }
        return false;
    }

    static FORTNITE = (property:string) :boolean=>{
        switch(property){
            case "kill": return true;
            case "knockouts": return true;
            case "revived": return true;
            case "health": return true;
            case "total_shots": return true;
            case "shield": return true;
            case "mode": return true;
        }
        return false;
    }

    static VALORENT =(property:string) :boolean=>{
        switch(property){
            case "total_kills": return true;
            case "deaths": return true;
            case "assists": return true;
            case "headshots": return true;
            case "spikes_defused": return true;
            case "spikes_planted": return true;
            case "damage_done": return true;
            case "team_scores": return true;
            case "match_outcome": return true;
            case "agent": return true;
            case "region": return true;
            case "game_mode": return true;
            case "damage_taken": return true;
        }
        return false;
    }
}