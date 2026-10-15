import express from "express";
import { createJob } from "../controllers/job.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createJob);

export default router;
