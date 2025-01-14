import { Router } from "express";

import { getSubscriptions } from "../Controller/getSubscriptions";
import { setSubscription } from "../Controller/addSubscriptions";
import { deleteSubscription } from "../Controller/deleteSubscriptions";
import { editSubscription } from "../Controller/editSubscriptions";

export const markitPlaceRouter = Router();

markitPlaceRouter.post("/set-supscriptions", setSubscription);

markitPlaceRouter.get("/get-supscriptions", getSubscriptions);

markitPlaceRouter.get("/delete-supscription/:supscriptionId", deleteSubscription);

markitPlaceRouter.post("/edit-supscription/:subscriptionId", editSubscription);
