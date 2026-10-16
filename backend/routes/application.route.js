import express from "express";
import { applyForJob, getApplicants, getAppliedJobs } from "../controllers/application.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/:jobId/apply").post(isAuthenticated, applyForJob);
router.get("/applied-jobs", isAuthenticated, getAppliedJobs);
router.get("/:jobId/applicants", isAuthenticated, getApplicants);

export default router;
