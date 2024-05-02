import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


export default function AddTraining(props) {
    const [open, setOpen] = React.useState(false);
    const [training, setTraining] = React.useState({
        date: '', activity: '', duration: '', customer: ''
    });

    const handleClickOpen = () => {
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

    const addTraining = () => {
        props.saveTraining(training);
        handleClose();
    }

    return (
        <React.Fragment>
            <Button style={{ margin: 10 }} variant="outlined" onClick={handleClickOpen}>
                Add new training
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle id="form-dialog-title">New training</DialogTitle>
                <DialogContent>
                    <DateTimePicker
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
                        {props.customers.map(customer => (
                            <MenuItem key={customer._links.self.href} value={customer._links.self.href}>
                                {customer.firstname + ' ' + customer.lastname}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={addTraining}>Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}