import { Router } from "express";
import { allInventoryInfo } from "../Controllers/allInventoryInfo";
import { getUserInventory } from "../Controllers/getUserInventory";

export const inventoryRouter = Router();

inventoryRouter.get("/all/:userId", allInventoryInfo);

inventoryRouter.post("/user-inventory", getUserInventory);

