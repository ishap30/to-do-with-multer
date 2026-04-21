import express from "express";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  deleteCompleted,
} from "../controllers/todoController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// 📥 GET
router.get("/", getTodos);
router.get("/:id", getTodoById);

// 📤 CREATE (with image)
router.post("/", upload.single("image"), createTodo);

// ✏️ UPDATE (with optional image)
router.put("/:id", upload.single("image"), updateTodo);

// 🔁 TOGGLE
router.patch("/:id/toggle", toggleTodo);

// ⚠️ IMPORTANT: keep this BEFORE "/:id"
router.delete("/completed", deleteCompleted);

// 🗑 DELETE
router.delete("/:id", deleteTodo);

export default router;