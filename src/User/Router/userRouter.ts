import { Router } from "express";
import { basicInfoController } from "../Controllers/basicInfo";
import { profileInfoController } from "../Controllers/profileData";
import { updateProfileInfoController } from "../Controllers/updateUserBasicInfo";
import { createProfileController } from "../Controllers/createUserProfile";

export const userRouter = Router();

userRouter.get("/basic-info/:userId", basicInfoController);

userRouter.get("/profile-data/:userId", profileInfoController);

userRouter.post("/profile-data/:authId", updateProfileInfoController);
