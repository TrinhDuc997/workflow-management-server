import express from "express";
import usersController from "../controllers/usersController.js";
import taskController from "../controllers/taskController.js";

const router = express.Router();

// Add User
router.post("/addUser", usersController.addUsers);
// Login
router.post("/login", usersController.login);
// Get List User
router.get("/getListUser", usersController.getListUser);
export default router;
