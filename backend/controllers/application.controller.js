import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyForJob = async (req, res) => {
  try {
    // 1. Check karo ki logged-in user student hai
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can apply for jobs",
      });
    }

    // 2. URL se Job ID nikaalo
    const { jobId } = req.params;

    // 3. Logged-in student ki ID nikaalo
    const applicantId = req.user.userId;

    // 4. Check karo ki job exist karti hai
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 5. Check karo ki student pehle apply toh nahi kar chuka
    const existingApplication = await Application.findOne({
      applicant: applicantId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // 6. Application database mein save karo
    const application = await Application.create({
      applicant: applicantId,
      job: jobId,
    });

    // 7. Send Success response
    return res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      data: application,
    });
  } catch (error) {
    // handle Unique index duplicate
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    console.error("Apply for job error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
