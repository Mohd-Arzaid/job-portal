import { User } from "../models/user.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { registerSchema } from "../validators/user.validator.js";
import bcrypt from "bcrypt";

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

    const { fullName, email, phoneNumber, password, role } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Get the uploaded file from Multer middleware
    const file = req.file;
    const profilePhotoUrl = file ? await uploadToCloudinary(file) : "";

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user in MongoDB
    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });

    // Send success response without exposing the password
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
