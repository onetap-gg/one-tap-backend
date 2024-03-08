import { Router } from "express";
import { getAllData } from "../Controllers/getAllData";
import { getGameSpecificData } from "../Controllers/getGameSpecificData";
export const leaderBoardRouter = Router()

leaderBoardRouter.get("/all-data",getAllData)

leaderBoardRouter.get("/game-specific/:gameId",getGameSpecificData)