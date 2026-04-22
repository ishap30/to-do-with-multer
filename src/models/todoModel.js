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
    attachment: {
      filename: { type: String, default: null },
      originalname: { type: String, default: null },
      mimetype: { type: String, default: null },
      size: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
