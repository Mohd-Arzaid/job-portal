import { Company } from "../models/company.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { registerCompanySchema } from "../validators/company.validator.js";

export const registerCompany = async (req, res) => {
  try {
    // 1. Only recruiters can register companies
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can register a company",
      });
    }

    // 2. Validate text fields
    const result = registerCompanySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    const { name, description, website, location } = result.data;
    const userId = req.user.userId;

    // 4. Check if user already registered a company
    const existingCompany = await Company.findOne({ userId });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "You have already registered a company",
      });
    }

    // 5. Get uploaded company logo file and upload to Cloudinary
    const file = req.file;
    const logoUrl = file
      ? await uploadToCloudinary(file, "job-portal/company-logos")
      : "";

    // 6. Create company in database
    const company = await Company.create({
      name,
      description,
      website,
      location,
      logo: logoUrl,
      userId,
    });

    // 7. Send response
    return res.status(201).json({
      success: true,
      message: "Company registered successfully",
      data: company,
    });
  } catch (error) {
    console.error("Register company error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    // 1. Get logged-in recruiter's ID
    const userId = req.user.userId;

    // 2. Find the company registered by this recruiter
    const company = await Company.findOne({ userId });

    // 3. If company doesn't exist
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found. Please register your company first.",
      });
    }

    // 4. Return company details
    return res.status(200).json({
      success: true,
      message: "Company fetched successfully",
      data: company,
    });
  } catch (error) {
    console.error("Get company error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
