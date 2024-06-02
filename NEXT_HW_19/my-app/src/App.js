import React, { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editing, setEditing] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      const newTodos = [...todos, { id: Date.now(), text: newTodo }];
      setTodos(newTodos);
      setNewTodo('');
    }
  };

  const handleDeleteTodo = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
  };

  const handleEditTodo = (id) => {
    const todo = todos.find(todo => todo.id === id);
    setEditing(id);
    setEditingText(todo.text);
  };

  const handleUpdateTodo = () => {
    const updatedTodos = todos.map(todo =>
      todo.id === editing ? { ...todo, text: editingText } : todo
    );
    setTodos(updatedTodos);
    setEditing(null);
    setEditingText('');
  };

  return (
    <div className="App">
      <h1>My ToDo List</h1>
      <div className="todo-form">
        <input
          type="text"
          className="new-todo-input"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <button onClick={handleAddTodo} className="add-todo-button">추가하기</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            {editing === todo.id ? (
              <>
                <input
                  type="text"
                  className="edit-todo-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={handleUpdateTodo} className="update-todo-button">수정완료</button>
              </>
            ) : (
              <>
                <span className="todo-text">{todo.text}</span>
                <button onClick={() => handleEditTodo(todo.id)} className="edit-todo-button">수정</button>
                <button onClick={() => handleDeleteTodo(todo.id)} className="delete-todo-button">삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
