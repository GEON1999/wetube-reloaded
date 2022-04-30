import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

const hadleOpen = () => console.log("✔ Connected to DB")
db.on("error", (error) => console.log("DB error", error));
db.once("open", hadleOpen);

