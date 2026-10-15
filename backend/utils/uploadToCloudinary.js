import cloudinary from "../config/cloudinary";
import convertFileToDataUri from "./convertFileToDataUri";

const uploadToCloudinary = async (file) => {
  const fileUri = convertFileToDataUri(file);

  // Upload the image to the job-portal folder
  const result = await cloudinary.uploader.upload(fileUri.content, {
    folder: "job-portal",
  });
  
  // Return the uploaded image's secure URL
  return result.secure_url;
};

export default uploadToCloudinary;
