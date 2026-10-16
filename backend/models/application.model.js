import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // Kis student ne apply kiya
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Kis job ke liye apply kiya
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // Application ka current status
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

// Ek student ek hi job ke liye
// duplicate application nahi kar sakta
// .index() -> schema ke data par ek special database rule lagata hai 
// rule ye hai ki -> applicant field aur job field ko include karo aur 1 ka matlab hai ascending order
// unique : true -> mtlb unique rahega , dubara se applicant aur job ka same combination insert nhi ho skta
applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
