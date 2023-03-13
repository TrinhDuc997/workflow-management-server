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
// Get profile
router.get("/getProfile", usersController.getProfile);
// Get profile
router.put("/updateProfile", usersController.updateProfile);
// delete User
router.delete("/deleteUser", usersController.deleteUser);
export default router;
