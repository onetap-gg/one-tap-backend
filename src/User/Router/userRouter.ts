import { Router } from "express";
import { basicInfoController } from "../Controllers/basicInfo";
import { profileInfoController } from "../Controllers/profileData";

export const userRouter = Router()

userRouter.get("/basic-info/:userId",basicInfoController)

userRouter.get("/profile-data/:userId",profileInfoController)