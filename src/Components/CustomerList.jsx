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

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function CustomerList() {

    const [customers, setCustomers] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [training, setTraining] = useState({});
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
                            customer: customerData.firstname + ' ' + customerData.lastname
                        }));
                });
                Promise.all(fetchCustomerDataPromises)
                    .then(trainingsWithCustomerData => {
                        setTrainings(trainingsWithCustomerData);
                    });
            });

    };


    const [columnDefs, setColumnDefs] = useState([
        { field: 'firstname', filter: "floating" },
        { field: 'lastname', filter: "floating" },
        { field: 'streetaddress', filter: "floating" },
        { field: 'postcode', filter: "floating" },
        { field: 'city', filter: "floating" },
        { field: 'email', filter: "floating" },
        { field: 'phone', filter: "floating" },
    ]);

    const [columnDefs2, setColumnDefs2] = useState([
        { field: 'date', valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm'), filter: "floating" },
        { field: 'duration', filter: "floating" },
        { field: 'activity', filter: "floating" },
        { headerName: 'Customer', field: 'customer', filter: "floating" },
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
        justify-content: left;

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
        align-items: left;
        justify-content: left;
        align-content: space-between;
        `,
    );


    return (
        <Tabs defaultValue={0}>
            <TabsList>
                <Tab value={0}>Customers</Tab>
                <Tab value={1}>Trainings</Tab>
            </TabsList>
            <TabPanel value={1}>
                <div className="ag-theme-material" align='left' style={{ width: 1400, height: 1000 }}>
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
                <div className="ag-theme-material" align='left' style={{ width: 1400, height: 1000 }}>
                    <AgGridReact filterable={true}
                        ref={gridRef}
                        onGridReady={params => gridRef.current = params.api}
                        rowData={customers}
                        columnDefs={columnDefs}
                        rowSelection="single"
                    />
                </div>
            </TabPanel>
        </Tabs>
    );


}

export default CustomerList;