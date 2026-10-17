import express from "express";
import { getProfile, login, logout, register } from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/upload.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/profile").get(isAuthenticated, getProfile);
router.post("/logout", logout);

export default router;
