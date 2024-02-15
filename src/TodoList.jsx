import { useState } from "react";
import TodoTable from "./TodoTable";

function TodoList() {

    const [todo, setTodo] = useState({ date: '', desc: '' });
    const [todos, setTodos] = useState([]);

    const handleChange = (event) => {
        setTodo({ ...todo, [event.target.name]: event.target.value });
    };

    const addTodo = () => {
        setTodos([...todos, todo]);
        setTodo({ date: '', desc: '' });
    };

    return (
        <>
            <h1>Simple Todolist</h1>
            <h2>Add todo:</h2>
            <div className="todo-section">
                Description:<input type="text" name="desc" onChange={handleChange} value={todo.desc} />
                Date:<input type="date" name="date" onChange={handleChange} value={todo.date} />
                <button onClick={addTodo}>Add</button></div>
            <div className="todo-list">
                <TodoTable todos={todos} />
            </div>
        </>
    );
}

export default TodoList;