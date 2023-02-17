import express from "express";
import usersController from "../controllers/usersController.js";

const router = express.Router();

// Add User
router.post("/addUser", usersController.addUsers);
// Login
router.post("/login", usersController.login);

export default router;
