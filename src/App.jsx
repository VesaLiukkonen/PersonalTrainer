import './App.css';
import CustomerList from "./Components/CustomerList";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

function App() {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CustomerList />
    </LocalizationProvider>
  );
}

export default App;
