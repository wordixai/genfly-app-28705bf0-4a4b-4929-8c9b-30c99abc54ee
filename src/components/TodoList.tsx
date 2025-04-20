import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TodoItem from "@/components/TodoItem";
import { Todo } from "@/types/todo";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    
    const todo: Todo = {
      id: uuidv4(),
      text: newTodo,
      completed: false,
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompletedTodos = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Add</Button>
      </form>

      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        {todos.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No tasks yet. Add one above!
          </div>
        ) : (
          <>
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </>
        )}
      </div>

      {todos.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <div>
            {todos.filter(todo => !todo.completed).length} items left
          </div>
          {todos.some(todo => todo.completed) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearCompletedTodos}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear completed
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;