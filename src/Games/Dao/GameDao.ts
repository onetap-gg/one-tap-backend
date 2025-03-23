import { Dao } from "../../utils/Classes/Dao";
import { GameNames } from "../Types/types";
interface DaoType {
    getAllGame : () => Promise<GameNames>
}


class GameDao extends Dao implements DaoType {
    getAllGame: () => Promise<GameNames> = async () =>{
        if(this.dbInstance === null) this.throwError("DB instance is not present");
        const {data ,error} = await this.dbInstance!
            .from("Game")
            .select(`gameName,gameImage,popular`)
        if(error) this.throwError(error)
        return data
    }
}

export const gameDao = new GameDao ()