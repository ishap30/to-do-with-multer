import { useEffect, useState } from "react";

const API = "http://localhost:5000";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null); // ✅ added

  // ✅ Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`${API}/todos`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        setError(`Could not load todos — (${err.message})`);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // ✅ FIXED: Add todo with FormData
  const addTodo = async () => {
    try {
      const formData = new FormData();
      formData.append("title", "New Todo");
      formData.append("priority", "medium");

      if (file) {
        formData.append("image", file); // ✅ send file
      }

      const res = await fetch(`${API}/todos`, {
        method: "POST",
        body: formData, // ❌ removed JSON + headers
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setTodos((prev) => [...prev, data]);

      setFile(null); // reset file
    } catch (err) {
      setError(`Could not add todo — (${err.message})`);
    }
  };

  // ✅ Toggle todo
  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`${API}/todos/${id}/toggle`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const updated = await res.json();
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updated : todo))
      );
    } catch (err) {
      setError(`Could not toggle todo — (${err.message})`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Todo App</h1>

      {/* ✅ Error */}
      {error && (
        <div
          style={{
            background: "#ffe0e0",
            border: "1px solid red",
            borderRadius: "6px",
            padding: "10px",
            marginBottom: "16px",
          }}
        >
          ⚠️ {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* ✅ FILE INPUT (important) */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* ✅ BUTTON */}
      <button onClick={addTodo} disabled={loading}>
        Add Todo
      </button>

      {loading && <p>Loading todos...</p>}

      {!loading && !error && todos.length === 0 && (
        <p>No todos yet</p>
      )}

      {/* ✅ TODOS */}
      {todos.map((todo) => (
        <div
          key={todo._id}
          onClick={() => toggleTodo(todo._id)}
          style={{
            cursor: "pointer",
            textDecoration: todo.completed ? "line-through" : "none",
            margin: "10px 0",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        >
          {todo.title} — {todo.priority}

          {/* ✅ SHOW IMAGE */}
          {todo.image && (
            <img
              src={`${API}${todo.image}`}
              alt=""
              style={{
                width: "100px",
                display: "block",
                marginTop: "8px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default App;