import Todo from "../models/todoModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET /todos  →  supports ?priority=high&completed=false&sortBy=dueDate
export const getTodos = async (req, res) => {
  try {
    const { priority, completed, sortBy } = req.query;

    const filter = {};
    if (priority) filter.priority = priority;
    if (completed !== undefined) filter.completed = completed === "true";

    const sortOptions = {
      dueDate: { dueDate: 1 },
      priority: { priority: -1 },
      createdAt: { createdAt: -1 },
    };
    const sort = sortOptions[sortBy] || sortOptions.createdAt;

    const todos = await Todo.find(filter).sort(sort);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /todos/:id
export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /todos  (multipart/form-data)
export const createTodo = async (req, res) => {
  try {
    const { title, priority, dueDate } = req.body;

    const attachment = req.file
      ? {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : { filename: null, originalname: null, mimetype: null, size: null };

    const todo = await Todo.create({
      title,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      attachment,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /todos/:id  (multipart/form-data)
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    const { title, completed, priority, dueDate } = req.body;

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate ? new Date(dueDate) : null;

    // If a new file was uploaded, delete old one and replace
    if (req.file) {
      if (todo.attachment?.filename) {
        const oldPath = path.join(__dirname, "../../uploads", todo.attachment.filename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      todo.attachment = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    }

    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /todos/:id/toggle
export const toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /todos/:id  — also removes uploaded file
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (todo.attachment?.filename) {
      const filePath = path.join(__dirname, "../../uploads", todo.attachment.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await todo.deleteOne();
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /todos/completed
export const deleteCompleted = async (req, res) => {
  try {
    // Delete files for completed todos first
    const completedTodos = await Todo.find({ completed: true });
    completedTodos.forEach((todo) => {
      if (todo.attachment?.filename) {
        const filePath = path.join(__dirname, "../../uploads", todo.attachment.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    const result = await Todo.deleteMany({ completed: true });
    res.json({ message: `Deleted ${result.deletedCount} completed todo(s)` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
