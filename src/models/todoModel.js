import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },

    // ✅ NEW FIELD (for multer uploads)
    image: {
      type: String,
      default: null, // will store file path like "uploads/123.png"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);