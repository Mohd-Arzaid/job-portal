// Converts the uploaded file into a Data URI string so it can be uploaded to Cloudinary
import DataUriParser from "datauri/parser.js";
import path from "path";

// Convert the uploaded file into a Data URI
const convertFileToDataUri = (file) => {
  // Create a parser to generate the Data URI
  const parser = new DataUriParser();

  // Extract the file extension, e.g. ".png" or ".jpg"
  const extName = path.extname(file.originalname);

  // Convert the file buffer into a Data URI (string)
  return parser.format(extName, file.buffer);
};

export default convertFileToDataUri;
