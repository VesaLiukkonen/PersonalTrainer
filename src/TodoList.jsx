import { useState, useRef } from "react";
import * as React from 'react';
//import TodoTable from "./TodoTable";
import { AgGridReact } from "ag-grid-react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { buttonClasses } from '@mui/base/Button';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function TodoList() {

    const [todo, setTodo] = useState({ date: '', desc: '', priority: '' });
    const [todos, setTodos] = useState([]);
    const gridRef = useRef();

    /*const handleChange = (event) => {
        setTodo({ ...todo, [event.target.name]: event.target.value });
    };*/

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

    const handleDateChange = (date) => {
        setTodo({ ...todo, date });
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


    const Tab = styled(BaseTab)`
        font-family: 'IBM Plex Sans', sans-serif;
        olor: #000000;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 600;
        background-color: transparent;
        width: 100%;
        padding: 10px 12px;
        margin: 6px;
        border: none;
        border-radius: 7px;
        display: flex;
        justify-content: center;

    &.${buttonClasses.disabled} {
        opacity: 0.5;
        cursor: not-allowed;
    }
    `;

    const TabPanel = styled(BaseTabPanel)(
        ({ theme }) => `
        width: 100%;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 0.875rem;
        padding: 20px 12px;
        border-radius: 12px;
        opacity: 0.6;
        `,
    );

    const TabsList = styled(BaseTabsList)(
        ({ theme }) => `
        min-width: 400px;
        border-radius: 12px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        align-content: space-between;
        `,
    );


    return (
        <Tabs defaultValue={0}>
            <TabsList>
                <Tab value={0}>Home</Tab>
                <Tab value={1}>Todos</Tab>
            </TabsList>
            <TabPanel value={0}>Welcome to home page</TabPanel>
            <TabPanel value={1}>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        label="Description"
                        onChange={event => setTodo({ ...todo, desc: event.target.value })}
                        value={todo.desc} />
                    <TextField
                        label="Priority"
                        onChange={e => setTodo({ ...todo, priority: e.target.value })}
                        value={todo.priority}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={todo.date}
                            onChange={(date) => handleDateChange(date)} />
                    </LocalizationProvider>
                </Box>

                <button onClick={addTodo}>Add</button>
                <button onClick={handleDelete}>Delete</button>
                <div className="ag-theme-material" style={{ width: 700, height: 500 }}>
                    <AgGridReact
                        ref={gridRef}
                        onGridReady={params => gridRef.current = params.api}
                        rowData={todos}
                        columnDefs={columnDefs}
                        rowSelection="single"
                    />
                </div>
            </TabPanel>
        </Tabs>
    );


}

export default TodoList;