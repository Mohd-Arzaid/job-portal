import express from "express";
import { applyForJob } from "../controllers/application.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/:jobId/apply").post(isAuthenticated, applyForJob);

export default router;
