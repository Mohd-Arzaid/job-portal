import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { singleUpload } from "../middlewares/upload.middleware.js";
import { getCompany, registerCompany } from "../controllers/company.controller.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, singleUpload, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);

export default router;
