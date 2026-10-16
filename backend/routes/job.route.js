import express from "express";
import { createJob, getAllJobs } from "../controllers/job.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createJob);
router.route("/all").get(getAllJobs);

export default router;
