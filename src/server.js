import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
    });

app.set("view engine", "pug");
app.use("/convert", express.static("node_modules/@ffmpeg/core/dist"))
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//Express에 내장된 미들웨어 기능입니다.
//body-parser를 기반으로 request payload로 전달한 JSON을 파싱합니다.
//문자열을 받아서 json으로 바꿔줍니다.
//주의할 점은 express.json()은 header에 Content-Type이 express.json()의 기본 값인 "application/json"과 일치하는 request만 보는 미들웨어를 반환합니다.
//다시 말해, headers: { "Content-type": "application/json" }인 request만 express.json()을 실행한다.


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

app.use(flash());
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app