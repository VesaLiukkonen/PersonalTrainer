import { useState, useEffect, useRef } from "react";
import * as React from 'react';
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
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment';

import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import AddTraining from './AddTraining';
//import EditTraining from './EditTraining';
import MyCalendar from './MyCalendar';
import DownloadCSV from './DownloadCSV';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import 'ag-grid-community/styles/ag-theme-alpine.css';

function CustomerList() {

    const [customers, setCustomers] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [training, setTraining] = useState({});
    const [events, setEvents] = useState({});
    const gridRef = useRef();
    //const formattedDate = dayjs(new Date()).format('DD.MM.YYYY HH:mm');

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers')
            .then(response => response.json())
            .then(data => setCustomers(data._embedded.customers));
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings')
            .then(response => response.json())
            //ChatGpt helped in getting the customer data from trainings
            .then(trainingData => {
                const trainings = trainingData._embedded.trainings;

                const fetchCustomerDataPromises = trainings.map(training => {
                    const customerUrl = training._links.customer.href;
                    return fetch(customerUrl)
                        .then(response => response.json())
                        .then(customerData => ({
                            ...training,
                            customer: customerData.firstname + ' ' + customerData.lastname ? 
                            customerData.firstname + ' ' + customerData.lastname : 
                            "No name"
                        }))
                        .catch(error => ({
                            ...training,
                            customer: "No name"
                        }));
                });
                Promise.all(fetchCustomerDataPromises)
                    .then(trainingsWithCustomerData => {
                        const events = trainingsWithCustomerData.map(training => {
                            const startTime = moment(training.date);
                            const endTime = startTime.clone().add(parseInt(training.duration), 'minutes');
                            return {
                                id: training.id,
                                title: training.activity + ' / ' + training.customer, // Remove duplicate key
                                start: startTime.toDate(),
                                end: endTime.toDate(),
                            };
                        });
                        setTrainings(trainingsWithCustomerData);
                        setEvents(events);
                    });
            })
    };

    const saveCustomer = (customer) => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
            .then(res => fetchData())
            .catch(err => console.error(err))
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const saveTraining = (training) => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(training)
        })
            .then(res => fetchData())
            .catch(err => console.error(err))
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
            </Button>
            {/*<IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
    </IconButton>*/}
        </React.Fragment>
    );

    const deleteCustomer = (customerUrl) => {
        if (window.confirm('Are you sure?')) {
            fetch(customerUrl, { method: 'DELETE' }) //gridRef.current.getSelectedNodes()[0].data._links.self.href
                .then(res => fetchData())
                .catch(err => console.error(err))
            setOpen(true);
        }
    };

    const deleteTraining = (trainingUrl) => {
        if (window.confirm('Are you sure?')) {
            fetch(trainingUrl, { method: 'DELETE' }) //gridRef.current.getSelectedNodes()[0].data._links.self.href
                .then(res => fetchData())
                .catch(err => console.error(err))
            setOpen(true);
        }
    };

    const updateCustomer = (customer, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
            .then(res => fetchData())
            .catch(err => console.error(err))
    };

    /*const updateTraining = (training, link) => {
      fetch(link, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(training)
      })
        .then(res => fetchData())
        .catch(err => console.error(err))
    };*/


    const [columnDefs, setColumnDefs] = useState([
        { field: 'firstname', filter: "floating" },
        { field: 'lastname', filter: "floating" },
        { field: 'streetaddress', filter: "floating" },
        { field: 'postcode', filter: "floating" },
        { field: 'city', filter: "floating" },
        { field: 'email', filter: "floating" },
        { field: 'phone', filter: "floating" },
        {
            headerName: 'Actions',
            cellRenderer: (params) => (
                <div>
                    <Button variant="outlined" color='error' onClick={() => deleteCustomer(params.data._links.self.href)}>Delete</Button>
                    <EditCustomer customer={params.data} updateCustomer={updateCustomer} />
                </div>
            )
        },
    ]);

    const [columnDefs2, setColumnDefs2] = useState([
        { field: 'date', valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm'), filter: "floating" },
        { field: 'duration', filter: "floating" },
        { field: 'activity', filter: "floating" },
        {
            headerName: 'Customer',
            field: 'customer',
            filter: "floating",
            cellRenderer: (params) => (
                <div>
                    {params.value ? params.value : "No name"}
                </div>
            )
        },
        {
            headerName: 'Actions',
            cellRenderer: (params) => (
                <div>
                    <Button variant="outlined" color='error' onClick={() => deleteTraining(params.data._links.self.href)}>Delete</Button>
                    {/*<EditTraining training={params.data} trainingCustomer={params.data._links.customer.href}updateTraining={updateTraining} customers={customers}/>*/}
                </div>
            )
        },
    ]);


    const Tab = styled(BaseTab)`
        font-family: 'IBM Plex Sans', sans-serif;
        color: #424242;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 600;
        background-color: transparent;
        width: 100px;
        padding: 5px 5px;
        margin: 5px;
        border: 5px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        outline: 2px solid #007bff;

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
        padding: 5px 5px;
        border-radius: 5px;
        justify-content: center;
        align-items: center;
        opacity: 0.6;
        `,
    );

    const TabsList = styled(BaseTabsList)(
        ({ theme }) => `
        min-width: 100%;
        border-radius: 4px;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        align-content: space-between;
        `,
    );


    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" >
            <Tabs defaultValue={0}>
                <TabsList>
                    <Tab value={0}>Customers</Tab>
                    <Tab value={1}>Trainings</Tab>
                    <Tab value={2}>Calendar</Tab>
                </TabsList>
                <TabPanel value={1}>
                    <AddTraining saveTraining={saveTraining} customers={customers} />
                    <div className="ag-theme-material" align='left' style={{ width: '100vw', height: 1000, margin: '0 auto' }}>
                        <AgGridReact filterable={true}
                            ref={gridRef}
                            onGridReady={params => gridRef.current = params.api}
                            rowData={trainings}
                            columnDefs={columnDefs2}
                            rowSelection="single"
                        />
                    </div>
                </TabPanel>
                <TabPanel value={0}>
                    <DownloadCSV customers={customers} fileName="customers" />
                    <AddCustomer saveCustomer={saveCustomer} />
                    <div className="ag-theme-material" align='left' style={{ width: '100vw', height: 1000, }}>
                        <AgGridReact filterable={true}
                            ref={gridRef}
                            onGridReady={params => gridRef.current = params.api}
                            rowData={customers}
                            columnDefs={columnDefs}
                            rowSelection="single"
                        />
                    </div>
                </TabPanel>
                <TabPanel value={2}>
                    <MyCalendar
                        events={events}
                    />
                </TabPanel>
            </Tabs>
        </Box>
    );


}

export default CustomerList;