import express, { Response, Request } from "express";
import helmet from "helmet";
import hpp from "hpp";
import { envVariables } from "./utils/envVariables";
import { userRouter } from "./User/Router/userRouter";
import { leaderBoardRouter } from "./LeaderBoard/Routers/leaderBoardRouter";
import { gamesRouter } from "./Games/Routes/gamesRouter";
import { inventoryRouter } from "./Inventory/Router/inventoryRouter";
import { challengesRouter } from "./challenges/Routers/challengesRouter";
import { markitPlaceRouter } from "./MarkitPlace/Router/martkitPlacerouter";
import cors from "cors";
import { OverWolfIdToNativeMapper } from "./utils/Middleware/OverWolfToNativeIdMapper";
import { subscriptionRouter } from "./subscriptions/Router/subscripitonsRouter";

const app = express();

// Configure helmet with all CORS policies disabled
const helmetConfig = {
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
};

// Apply security headers
app.use(helmet(helmetConfig));

// Enable CORS for all routes with all origins
app.use(cors());

// Rest of middleware
app.use(express.json());
app.use(hpp());

// Routes
app.get("/", async (req: Request, res: Response) => {
  res.status(200).json("Hi");
});

app.use("/user", userRouter);
app.use("/game", gamesRouter);
app.use("/inventory", inventoryRouter);
app.use("/marketplace", markitPlaceRouter);
app.use(OverWolfIdToNativeMapper);
app.use("/leaderboard", leaderBoardRouter);
app.use("/challenges", challengesRouter);
app.use("/subscriptions", subscriptionRouter);

app.use("*", (req, res) => {
  res.status(404).json("No Such Route");
});
const port: string = envVariables.PORT;

app.listen(port, (): void => {
  console.log(`Backend Running on http://localhost:${port}`);
});
