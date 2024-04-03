import './App.css';
import CustomerList from "./Components/CustomerList";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CustomerList />
      </LocalizationProvider>
  );
}

export default App;
