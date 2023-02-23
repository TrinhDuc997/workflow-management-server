import express from "express";
import taskController from "../controllers/taskController.js";

const router = express.Router();

router.post("/addTasks", taskController.addTask);

router.post("/editTask", taskController.editTask);

router.post("/deleteTask", taskController.deleteTask);

router.get("/getListTask", taskController.getListTask);

export default router;
