import Todo from "../models/todoModel.js";

// GET /todos
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

// ✅ POST /todos (with image upload)
export const createTodo = async (req, res) => {
  try {
    const { title, priority, dueDate } = req.body;

    const todo = await Todo.create({
      title,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      image: req.file ? req.file.path : null, // 🔥 multer integration
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ PUT /todos/:id (update with optional new image)
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    const { title, completed, priority, dueDate } = req.body;

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) {
      todo.dueDate = dueDate ? new Date(dueDate) : null;
    }

    // 🔥 if new image uploaded → replace old one
    if (req.file) {
      todo.image = req.file.path;
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

// DELETE /todos/:id
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    await todo.deleteOne();
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /todos/completed
export const deleteCompleted = async (req, res) => {
  try {
    const result = await Todo.deleteMany({ completed: true });
    res.json({ message: `Deleted ${result.deletedCount} completed todo(s)` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};