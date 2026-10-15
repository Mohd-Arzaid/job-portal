import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },
    profile: {
      profilePhoto: {
        type: String, // Store the Cloudinary URL of the user's profile photo
        default: "",
      },
    },
  },
  { timestamps: true }, // automatically add createdAt aur updatedAt
);

export const User = mongoose.model("User", userSchema);
