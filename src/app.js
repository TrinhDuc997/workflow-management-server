// import dependencies
import express from "express";
import bodyParser from "body-parser";
// import mongoose from "mongoose";
import logger from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routers/user.js";
import cors from "cors";
import morgan from "morgan";
dotenv.config();

/* CONNECT DATABASE - start */
mongoose.set("strictQuery", true);
mongoose
  .connect(
    `${process.env.DATABASE_URL}${process.env.DB_NAME}?${process.env.DB_OPTIONS}`,
    {
      serverSelectionTimeoutMS: 5000,
    }
  )
  .catch((err) => console.log(err));
/* CONNECT DATABASE - end */

// set up dependencies
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(cors());
app.use(morgan("common"));

// set up port number
const port = 8000;
// set up home route

app.get("/", (request, respond) => {
  respond.status(200).send(
    `<div style="width: 100%; display: flex; height: 100%; justify-content: center; align-items: center;"><h1 style="    background: -webkit-linear-gradient(#008524, #9eff9e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 72px;">Welcome To Workflow Management Server</h1></div>`
  );
});
//ROUTER API V1
app.use("/user", UserRouter);

app.listen(port, (request, respond) => {
  console.log(`Successful server start on ${port}!`);
});
