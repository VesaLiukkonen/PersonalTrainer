import React from 'react';
import Button from '@mui/material/Button';

//Source: https://medium.com/@gb.usmanumar/how-to-export-data-to-csv-json-in-react-js-ea45d940652a

const DownloadCSV = ({ customers, fileName }) => {
  const convertToCSV = (objArray) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    const properties = ['firstname', 'lastname', 'email', 'phone', 'streetaddress', 'postcode', 'city'];

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let j = 0; j < properties.length; j++) {
        const property = properties[j];
        if (line !== '') line += ',';
        line += array[i][property];
      }
      str += line + '\r\n';
    }
    return str;
  };

  const downloadCSV = () => {
    const csvData = new Blob([convertToCSV(customers)], { type: 'text/csv' });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button style={{ margin: 4 }} variant="outlined" onClick={downloadCSV}>Download CSV</Button>
  );
}

export default DownloadCSV;