import { Request,Response, NextFunction } from "express"
import { OVER_WOLF_TO_GAME_ID_MAPPER } from "../Constants";
export const OverWolfIdToNativeMapper = (req : Request,res : Response, next :NextFunction ) =>{
    let gameId : number | null = null;
    if(req.params.userId)
        gameId = Number(req.params.gameId)
    if(req.body.gameId)
        gameId = req.body.gameId
    console.log("overwolf id" , gameId)
    Object.entries(OVER_WOLF_TO_GAME_ID_MAPPER).forEach(([key, value]) => {
       if( gameId && value.OverWolfId === gameId){
        gameId =  value.GameId; 
       } 
    });
    if(gameId){
        if(req.params.gameId) req.params.gameId = gameId.toString()
        if(req.body.gameId) req.body.gameId = gameId.toString()
    }
    console.log("Native user id",gameId)
    next();
}