import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [priority, setPriority] = useState("medium");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const API = "http://localhost:5000";

  useEffect(() => {
    fetch(`${API}/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch(() => setTodos([]));
  }, []);

  const addTodo = async () => {
    if (!inputVal.trim()) return;

    const formData = new FormData();
    formData.append("title", inputVal.trim());
    formData.append("priority", priority);
    if (selectedFile) formData.append("attachment", selectedFile);

    const res = await fetch(`${API}/todos`, {
      method: "POST",
      body: formData, // No Content-Type header — browser sets multipart boundary
    });
    const data = await res.json();
    setTodos((prev) => [...prev, data]);
    setInputVal("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleTodo = async (id) => {
    const res = await fetch(`${API}/todos/${id}/toggle`, { method: "PATCH" });
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
  };

  const deleteTodo = async (id, e) => {
    e.stopPropagation();
    await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const isImage = (mimetype) => mimetype && mimetype.startsWith("image/");

  const priorityLabel = { high: "!!!", medium: "!!", low: "!" };
  const done = todos.filter((t) => t.completed).length;

  return (
    <div className="app">
      <div className="noise" />

      <header className="header">
        <div className="header-top">
          <span className="label-tag">TASK MANAGER</span>
          <span className="counter">{done}/{todos.length} DONE</span>
        </div>
        <h1 className="title">
          <span className="title-line">TODO</span>
          <span className="title-line accent">LIST.</span>
        </h1>
      </header>

      <div className="input-row">
        <input
          className="text-input"
          type="text"
          placeholder="WHAT NEEDS DOING?"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <div className="priority-group">
          {["low", "medium", "high"].map((p) => (
            <button
              key={p}
              className={`priority-btn ${priority === p ? "active" : ""} pri-${p}`}
              onClick={() => setPriority(p)}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="add-btn" onClick={addTodo}>
          <span>ADD</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── FILE UPLOAD SECTION ── */}
      <div className="upload-section">
        <div className="upload-label">
          <span className="label-tag">ATTACHMENT</span>
          <span className="upload-hint">JPG · PNG · PDF · DOC · TXT · ZIP — MAX 5MB</span>
        </div>
        <div
          className={`upload-zone ${selectedFile ? "has-file" : ""}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {selectedFile ? (
            <div className="file-preview">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M9 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6L9 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 1v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">{formatFileSize(selectedFile.size)}</span>
              <button className="file-clear" onClick={clearFile}>×</button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 13V3M10 3L6 7M10 3L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 14v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>CLICK TO ATTACH FILE</span>
            </div>
          )}
        </div>
      </div>

      {/* ── TODO LIST ── */}
      <div className="todo-list">
        {todos.length === 0 && (
          <div className="empty-state">
            <span>NO TASKS YET</span>
            <span className="empty-sub">ADD SOMETHING ABOVE ↑</span>
          </div>
        )}
        {todos.map((todo, i) => (
          <div
            key={todo._id}
            className={`todo-item ${todo.completed ? "completed" : ""} pri-border-${todo.priority}`}
            onClick={() => toggleTodo(todo._id)}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="todo-check">
              {todo.completed && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L6 11L12 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="todo-content">
              <span className="todo-title">{todo.title}</span>
              {todo.attachment?.filename && (
                <a
                  className={`todo-attachment ${isImage(todo.attachment.mimetype) ? "is-image" : ""}`}
                  href={`${API}/uploads/${todo.attachment.filename}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title={todo.attachment.originalname}
                >
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                    <path d="M9 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6L9 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M9 1v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                  <span>{todo.attachment.originalname}</span>
                  <span className="attach-size">{formatFileSize(todo.attachment.size)}</span>
                </a>
              )}
            </div>
            <span className={`todo-priority pri-${todo.priority}`}>
              {priorityLabel[todo.priority] || "!"}
            </span>
            <button
              className="delete-btn"
              onClick={(e) => deleteTodo(todo._id, e)}
              title="Delete"
            >×</button>
          </div>
        ))}
      </div>

      {todos.length > 0 && (
        <div className="progress-bar-wrap">
          <div
            className="progress-bar"
            style={{ width: `${(done / todos.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
