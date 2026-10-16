import mongoose from "mongoose";
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

export const getAppliedJobs = async (req, res) => {
  try {
    // 1. Sirf student apni applications dekh sake
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view their applications",
      });
    }

    // 2. Logged-in student ki ID
    const applicantId = req.user.userId;

    // 3. Student ki saari applications database se lao
    const applications = await Application.find({
      applicant: applicantId,
    })
      .populate({
        path: "job", // Job ki ID ki jagah us Job ka actual data laao
        populate: {
          path: "company",
          select: "name logo location",
        },
      })
      .sort({ createdAt: -1 }) // descending order, new data phele aayega
      .lean();

    // 4. Response bhejo
    return res.status(200).json({
      success: true,
      message: "Applied jobs fetched successfully",
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Get applied jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getApplicants = async (req, res) => {
  try {
    // 1. Check karo ki logged-in user recruiter hai
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can view applicants",
      });
    }
    // 2. URL se Job ID nikaalo
    const { jobId } = req.params;

    // 3. Check karo ki Job ID ka format valid hai
    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // 4. Database se job find karo
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 5. Check karo ki job isi recruiter ne create ki hai
    if (job.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these applicants",
      });
    }

    // 6. Job ke saare applicants fetch karo
    const applications = await Application.find({
      job: jobId,
    })
      .populate("applicant", "fullName email phoneNumber profile")
      .sort({ createdAt: -1 })
      .lean();

    // 7. Success response bhejo
    return res.status(200).json({
      success: true,
      message: "Applicants fetched successfully",
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Get applicants error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    // 1. Check karo ki user recruiter hai
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can update application status",
      });
    }
    // 2. URL se Application ID nikaalo
    const { applicationId } = req.params;

    // 3. Application ID ka format validate karo
    if (!mongoose.isValidObjectId(applicationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    // 4. Request body se naya status lo
    const { status } = req.body;

    // 5. Sirf Accepted aur Rejected allow karo
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Accepted or Rejected",
      });
    }

    // 6. Application database se find karo
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // 7. Application ki job find karo
    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 8. Verify karo ki job isi recruiter ki hai
    if (job.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this application",
      });
    }

    // 9. Application ka status update karo
    application.status = status;
    await application.save();

    // 10. Updated application return karo
    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
