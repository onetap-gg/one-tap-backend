import { Router } from "express";
import { getAllData } from "../Controllers/getAllGames";

export const gamesRouter = Router()

gamesRouter.get("/all-data",getAllData)