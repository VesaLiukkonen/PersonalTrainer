import { useState, useRef } from "react";
//import TodoTable from "./TodoTable";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function TodoList() {

    const [todo, setTodo] = useState({ date: '', desc: '', priority: '' });
    const [todos, setTodos] = useState([]);
    const gridRef = useRef();

    const handleChange = (event) => {
        setTodo({ ...todo, [event.target.name]: event.target.value });
    };

    const addTodo = () => {
        setTodos([...todos, todo]);
        setTodo({ date: '', desc: '', priority: '' });
    };

    const handleDelete = () => {
        if (gridRef.current.getSelectedNodes().length > 0) {
            setTodos(todos.filter((todo, index) => 
              index != gridRef.current.getSelectedNodes()[0].id))
          }
          else {
            alert('Select a row first!');
          }
        };

    /*const deleteTodo = (index) => {
        const updatedTodos = todos.filter((todo, i) => i !== index);
        setTodos(updatedTodos);
    };*/

    const [columnDefs, setColumnDefs] = useState([
        { field: 'desc', filter: "floating" },
        { field: 'priority', filter: "floating" },
        { field: 'date', filter: "floating" }
    ]);


    return (
        <>
            <input
                placeholder="Description"
                onChange={e => setTodo({ ...todo, desc: e.target.value })}
                value={todo.desc} />
            <input
                placeholder="Priority"
                onChange={e => setTodo({ ...todo, priority: e.target.value })}
                value={todo.priority} />
            <input
                placeholder="Date"
                type="date"
                onChange={e => setTodo({ ...todo, date: e.target.value })}
                value={todo.date} />
            <button onClick={addTodo}>Add</button>
            <button onClick={handleDelete}>Delete</button>
            <div className="ag-theme-material" style={{ width: 700, height: 500 }}>
                <AgGridReact
                    ref={gridRef}
                    onGridReady={ params => gridRef.current = params.api }
                    rowData={todos}
                    columnDefs={columnDefs}
                    rowSelection="single"
                />
            </div>
        </>
    );
}

export default TodoList;