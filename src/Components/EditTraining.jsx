import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


export default function EditTraining(props) {
    const [open, setOpen] = React.useState(false);
    const [training, setTraining] = React.useState({
        date: '', activity: '', duration: '', customer: '',
    });

    const handleClickOpen = () => {
        console.log(props.training)
        console.log(props.trainingCustomer)
        setTraining({date: '', activity: props.training.activity, duration: props.training.duration, customer: props.training.customer.id})
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (e) => {
        setTraining({ ...training, [e.target.name]: e.target.value })
    };

    const handleDateChange = (e) => {
        setTraining({ ...training, date: e.toISOString() })
    };

    const updateTraining = () => {
        props.updateTraining(training);
        handleClose();
    }

    return (
        <React.Fragment>
            <Button style={{ margin: 5 }} variant="outlined" onClick={handleClickOpen}>
                Edit
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle id="form-dialog-title">Edit training</DialogTitle>
                <DialogContent>
                    <DatePicker
                        label="Date"
                        value={training.date}
                        onChange={e => handleDateChange(e)}
                        format="DD.MM.YYYY HH:mm"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="activity"
                        value={training.activity}
                        onChange={e => handleInputChange(e)}
                        label="Activity"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="duration"
                        value={training.duration}
                        onChange={e => handleInputChange(e)}
                        label="Duration"
                        fullWidth
                        variant="standard"
                    />
                    <Select
                        required
                        margin="dense"
                        name="customer"
                        value={training.customer}
                        onChange={e => handleInputChange(e)}
                        label="Customer"
                        fullWidth
                        variant="standard"
                    >
                        {/*{props.customers.map(customer => (
                            <MenuItem key={customer._links.self.href} value={customer._links.self.href}>
                                {customer.firstname + ' ' + customer.lastname}
                            </MenuItem>
                        ))}*/}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={updateTraining}>Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}