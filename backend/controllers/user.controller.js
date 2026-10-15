import cloudinary from "../config/cloudinary.js";
import convertFileToDataUri from "../utils/convertFileToDataUri.js";
import { registerSchema } from "../validators/user.validator.js";

export const register = async (req, res) => {
  try {
    // validate request body
    const result = registerSchema.safeParse(req.body);

    // if validation fails
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    // Get the uploaded file from Multer middleware
    const file = req.file;
    


    const { fullName, email, phoneNumber, password, role } = result.data;
    return res.status(200).json({
      success: true,
      message: "Validation passed successfully",
      data: { fullName, email, phoneNumber, role },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
