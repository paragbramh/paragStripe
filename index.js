import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/subsRoute.js";
import { env } from "./utils/enviroment.js";

const app = express();
const DB_CONNECTION_URL =
  "mongodb+srv://imdb:vidaloca@cluster0.on0un.mongodb.net/subsDB?retryWrites=true&w=majority";

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/", router);

const CONNECTION_URL = DB_CONNECTION_URL;

const PORT = process.env.PORT || 5000;



mongoose
  .connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log("server start")))
  .catch((err) => console.log(err.message));

  if ( process.env.NODE_ENV == "production"){

    app.use(express.static("client/build"));

    const path = require("path");

    app.get("*", (req, res) => {

        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));

    })


}