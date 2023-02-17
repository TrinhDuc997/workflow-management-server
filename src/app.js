// import dependencies
import express from "express";
import bodyParser from "body-parser";
// import mongoose from "mongoose";
import logger from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routers/user.js";
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
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// set up port number
const port = 8000;
// set up home route

app.get("/", (request, respond) => {
  respond.status(200).json({
    message: "Welcome to Project Support",
  });
});
//ROUTER API V1
app.use("/user", UserRouter);

app.listen(port, (request, respond) => {
  console.log(`Our server is live on ${port}. Yay!`);
});
