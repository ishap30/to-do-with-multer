import express from "express";
import upload from "../config/multer.js";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  deleteCompleted,
} from "../controllers/todoController.js";

const router = express.Router();

router.get("/", getTodos);                              // GET    /todos
router.get("/:id", getTodoById);                        // GET    /todos/:id
router.post("/", upload.single("attachment"), createTodo);       // POST   /todos
router.put("/:id", upload.single("attachment"), updateTodo);     // PUT    /todos/:id
router.patch("/:id/toggle", toggleTodo);                // PATCH  /todos/:id/toggle
router.delete("/completed", deleteCompleted);           // DELETE /todos/completed
router.delete("/:id", deleteTodo);                      // DELETE /todos/:id

export default router;
