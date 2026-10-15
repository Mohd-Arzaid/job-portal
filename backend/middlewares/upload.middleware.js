// This middleware receives the user's uploaded file and temporarily stores it in RAM so the controller can process it later
import multer from "multer";

// Store uploaded files temporarily in RAM (memory)
// Files are not saved directly to the server's disk
const storage = multer.memoryStorage();

// Accept only one file from the request
// The form-data field name must be "file"
export const singleUpload = multer({
  storage,
   limits: {
    fileSize: 5 * 1024 * 1024, // Maximum 5 MB
    files: 1, // Only one file
  },
}).single("file");
