import express from "express";
import path from 'path';
import { fileURLToPath } from "url";
import {config} from "dotenv";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import adminRouter from "./routes/admin.js";
import userRouter from "./routes/users.js";
import articleRouter from "./routes/articles.js"
import {connectDb }from "./baseDEdonnees/db.js";
import cors from "cors";
import bodyParser from "body-parser";

config()
connectDb()



const app = express()
const port = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/article", articleRouter);
connectDb()
.then(()=>{
    app.listen(port, () => console.log(`le serveur a bien demarrer sur http://localhost:${port}`));
}).catch(()=>{
    console.log("ok");
})
