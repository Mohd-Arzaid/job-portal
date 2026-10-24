import cloudinary from "../config/cloudinary.js";
import convertFileToDataUri from "./convertFileToDataUri.js";

const uploadToCloudinary = async (file, folder = "job-portal") => {
  const fileUri = convertFileToDataUri(file);

  // Upload the image to the specified Cloudinary folder
  const result = await cloudinary.uploader.upload(fileUri.content, {
    folder,
  });
  
  // Return the uploaded image's secure URL
  return result.secure_url;
};

export default uploadToCloudinary;
