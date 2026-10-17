import { User } from "../models/user.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { loginSchema, registerSchema } from "../validators/user.validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // 1. Validate request body
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    const { fullName, email, phoneNumber, password, role } = result.data;

    // 2. Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // 3. Get the uploaded file from Multer middleware and upload profile photo to Cloudinary
    const file = req.file;
    const profilePhotoUrl = file ? await uploadToCloudinary(file) : "";

    // 4. Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create a new user in MongoDB
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

    // 6. Return success response without exposing the password
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
    // 7. Handle unexpected server errors
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    // 1. Validate request body
    const result = loginSchema.safeParse(req.body);

    // if validation fails
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    const { email, password, role } = result.data;

    // 2. Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Verify user's role
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: "Invalid role",
      });
    }

    // 4. Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // 6. Set JWT token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 7. Return successful login response
    return res.status(200).json({
      success: true,
      message: "Login successful",
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
    // 8. Handle unexpected server errors
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    // 1. Get authenticated user's ID
    const userId = req.user.userId;

    // 2. Find user in database
    const user = await User.findById(userId).select("-password");

    // 3. Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4. Return user profile
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const logout = async (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Return a successful logout response
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
