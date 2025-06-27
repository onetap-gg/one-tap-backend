import { Router } from "express";
import { basicInfoController } from "../Controllers/basicInfo";
import { profileInfoController } from "../Controllers/profileData";
import { getUserIdController } from "../Controllers/userIdController";
import { updateProfileInfoController } from "../Controllers/updateUserBasicInfo";
import { createProfileController } from "../Controllers/createUserProfile";
import { checkUserExistsController } from "../Controllers/checkUserExistsController";
import { basicInfoAllController } from "../Controllers/basicInfoAll";
import { dailyAccessCredits } from "../Controllers/dailyAccessCredit";
import { getLastRewardTimestamp } from "../Controllers/getLastRewardTimestamp";
import { getCoinsSummary } from "../Controllers/getCoinsSummary";
import { deleteUserController } from "../Controllers/deleteUserController";
import { suspendUserController } from "../Controllers/suspendUserController";
import { unsuspendUserController } from "../Controllers/unsuspendUserController";

export const userRouter = Router();

userRouter.get("/basic-info/:authId", basicInfoController);

userRouter.get("/:authId", getUserIdController);

userRouter.get("/profile-data/:userId", profileInfoController);

userRouter.post("/profile-data/:authId", updateProfileInfoController);

userRouter.get("/check-user-exists/:authId", checkUserExistsController);

userRouter.get("/all/basic-info", basicInfoAllController);

userRouter.post("/credit", dailyAccessCredits);

userRouter.get("/last-reward/:userId", getLastRewardTimestamp);

userRouter.post("/daily-access-credit", dailyAccessCredits);

userRouter.post("/coins-summary", getCoinsSummary);

userRouter.get("/delete-user/:authId", deleteUserController);

userRouter.get("/suspend-user/:authId", suspendUserController);

userRouter.get("/unsuspend-user/:authId", unsuspendUserController);
