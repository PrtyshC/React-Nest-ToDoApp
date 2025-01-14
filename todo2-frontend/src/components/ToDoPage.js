// ToDoPage.js
import React, { useState, useEffect } from 'react';
import './ToDoPage.css'; 

const ToDoPage = ({ onLogout }) => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await fetch('http://localhost:4000/todos', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
    
          if (response.ok) {
            const result = await response.json();
            if (result.success && Array.isArray(result.todos)) {
              setTodos(result.todos);
            } else {
              setError('The response format is invalid.');
            }
          } else {
            setError('Failed to fetch todos');
          }
        } catch (err) {
          console.error('Error fetching todos:', err);
          setError('An error occurred. Please try again later.');
        }
      } else {
        setError('No token found');
      }
    };
    
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (newTodoTitle.trim() && newTodoDescription.trim()) {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:4000/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: newTodoTitle,
            description: newTodoDescription,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.todo) {
            setTodos((prevTodos) => [...prevTodos, data.todo]);
            setNewTodoTitle('');
            setNewTodoDescription('');
          } else {
            setError('Failed to add new task.');
          }
        } else {
          setError('Failed to add new task.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    // Add fade-out class to the todo item for animation
    const todoItem = document.getElementById(id);
    if (todoItem) {
      todoItem.classList.add('fade-out');
    }
  
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:4000/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Wait for the fade-out animation to finish before removing the todo
        setTimeout(() => {
          setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        }, 500); // Match the fade-out animation duration
      } else {
        setError('Failed to delete the task.');
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('An error occurred. Please try again later.');
    }
  };
  

  const handleEditTodo = (todo) => {
    setEditTodoId(todo.id);
    setNewTodoTitle(todo.title);
    setNewTodoDescription(todo.description);
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    if (newTodoTitle.trim() && newTodoDescription.trim()) {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://localhost:4000/todos/${editTodoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: newTodoTitle,
            description: newTodoDescription,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.updatedTodo) {
            const updatedTodos = todos.map((todo) =>
              todo.id === editTodoId ? data.updatedTodo : todo
            );
            setTodos(updatedTodos);
            setEditTodoId(null);
            setNewTodoTitle('');
            setNewTodoDescription('');
          } else {
            setError('Failed to update the task.');
          }
        } else {
          setError('Failed to update the task.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-form-container">
        <h2>Your To-Do List</h2>
        {error && <p className="error">{error}</p>}
        <button onClick={onLogout}>Logout</button>
        
        {editTodoId ? (
          <form onSubmit={handleUpdateTodo}>
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Edit title"
              required
            />
            <textarea
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              placeholder="Edit description"
              required
            />
            <button type="submit">Update Todo</button>
            <button type="button" onClick={() => setEditTodoId(null)}>
              Cancel
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Add a new task title"
              required
            />
            <textarea
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              placeholder="Add a description"
              required
            />
            <button type="submit">Add Todo</button>
          </form>
        )}
      </div>

      <div className="todo-list">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id} id={todo.id}>
              <strong>{todo.title}</strong>
              <p>{todo.description}</p>
              <button class="icon-button" onClick={() => handleEditTodo(todo)}>
                      <i class="fas fa-edit"></i>
              </button>
              <button class="icon-button" onClick={() => handleDeleteTodo(todo.id)}>
                      <i class="fas fa-trash"></i>
              </button>
            </li>
          ))
        ) : (
          <p>No todos found.</p>
        )}
      </div>
    </div>
  );
};

export default ToDoPage;
