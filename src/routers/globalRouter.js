import express from "express";
import { tranding} from "../controllers/videoController";
import { join, login } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", tranding);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;