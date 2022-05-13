import express from "express";
import { getEdit, postEdit, see, logout, startGithubLogin, finishGithubLogin } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.route("/edit-profile").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get(":/id", see);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/logout", protectorMiddleware,  logout);


export default userRouter;