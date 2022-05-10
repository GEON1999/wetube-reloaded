import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}));

app.use(
    session ({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,   
        store: MongoStore.create({mongoUrl: process.env.DB_URL}),
    })
);


// session middleware
// session middlewar will remember everybody who comes to my website, even if they don't login
// session middleware will give text to my browser. then browser could remember who comes to my website indivisualy.
// then, browser will give cookie to my backend


app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/videos", videoRouter);

export default app