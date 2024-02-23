import React from "react";
import TodoList from "./TodoList";

function TodoTable(props) {
    const { todos, deleteTodo } = props;

    return <>
        <table>
            <tbody>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                </tr>
                {props.todos.map((item, index) => (
                    <tr key={index}>
                        <td>{item.date}</td>
                        <td>{item.desc}</td>
                        <td>
                            <button onClick={() => deleteTodo(index)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>;
};

export default TodoTable;