import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { createJobSchema } from "../validators/job.validator.js";

export const createJob = async (req, res) => {
  try {
    // 1. Only recruiters can create jobs
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can create jobs",
      });
    }

    // 2. Validate job details
    const result = createJobSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    // 3. Find recruiter's registered company
    const userId = req.user.userId;
    const company = await Company.findOne({ userId });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Please register your company first",
      });
    }

    // 4. Create job
    const job = await Job.create({
      ...result.data,
      company: company._id,
      createdBy: userId,
    });

    // 5. Send response
    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
