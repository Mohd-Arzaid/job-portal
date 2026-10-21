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

export const getAllJobs = async (req, res) => {
  try {
    // 1. Get search keyword
    const keyword = req.query.keyword?.trim() || "";

    // 2. Get pagination details
    const page = Math.max(1, Number(req.query.page) || 1); //user kaunsa page dekhna chahta hai
    const limit = Math.max(1, Number(req.query.limit) || 10); // ek page pai maximum jobs dikhani hai (default: 10)
    const skip = (page - 1) * limit; // Ye calculate karta hai ki current page tak pahunchne ke liye kitni jobs chhodni hain


    // page  = kaunsa page chahiye
    // limit = ek page par kitni jobs chahiye
    // skip  = kitni jobs chhodni hain

    // 3. Build search query
    const query = keyword
      ? {
          // $or means in conditions mein se koi ek bhi match ho jaaye, toh document return
          // $regex: keyword → title ke andar keyword ko search karta hai, sirf exact title match karna zaroori nahi
          // $options: "i" → uppercase aur lowercase ka difference ignore karta hai
          // for ex : keyword "react" ho toh "React Developer" bhi match ho sakta hai
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    // 4. Fetch jobs and total count
    const [jobs, totalJobs] = await Promise.all([
      // Promise.all ek sath dono jobs aur totalJobs operations ko start krta hai parallely
      Job.find(query)
        .populate("company", "name logo location")
        .sort({ createdAt: -1 }) // -1 means Descending order - newest jobs first
        .skip(skip) // Skip jobs from previous pages
        .limit(limit) // Return maximum 10 jobs per page
        .lean(), // Return plain JavaScript objects instead of Mongoose documents for faster reads
      Job.countDocuments(query), // Count all matching jobs
    ]);

    // 5. Calculate pagination metadata
    const totalPages = Math.ceil(totalJobs / limit); // Math.ceil -> round up krdeta h

    // 6. Send response
    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
        limit,
        hasNextPage: page < totalPages, //  true if current page is lesser than total pages
        hasPrevPage: page > 1, // true if page is greater than 1
      },
    });
  } catch (error) {
    console.error("Get all jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    // 1. URL se job ki ID nikaalo
    const { id } = req.params;

    // 2. Database mein us ID ki job search karo
    const job = await Job.findById(id)
      .populate("company", "name logo location")
      .lean();

    // 3. Agar job nahi mili
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    // 4. Job mil gayi toh response bhejo
    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  } catch (error) {
    console.error("Get job by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    // 1. Check karo ki user recruiter hai
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can access their jobs",
      });
    }

    // 2. Logged-in recruiter ki ID
    const userId = req.user.userId;

    // 3. Uski saari jobs fetch karo
    const jobs = await Job.find({ createdBy: userId })
      .populate("company", "name logo location")
      .sort({ createdAt: -1 })
      .lean();

    // 4. Response bhejo
    return res.status(200).json({
      success: true,
      message: "Recruiter jobs fetched successfully",
      data: jobs,
    });
  } catch (error) {
    console.error("Get recruiter jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
