import React, { useState, useRef } from 'react';
import './VehicleForm.css'; // Import CSS for styling
import { Button} from '@mui/material';
import {Send} from '@mui/icons-material'

const VehicleForm = () => {
  const [email, setEmail] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const requestData = {
      email,
      vehicle: vehicleNumber,
    };

    // Replace this with your actual API endpoint
    const apiUrl = 'https://example.com/api/submit-request';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Request sent successfully:', data);
        setIsLoading(false);
        // Reset form after submission
        formRef.current.reset();
      })
      .catch((error) => {
        console.error('Error sending request:', error);
        setIsLoading(false);
      });
  };

  return (
    <div className="form-container">
      <form ref={formRef} onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="vehicleNumber">Vehicle  Number:</label>
        <input
          type="text"
          id="vehicleNumber"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          required
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          endIcon={<Send />}
          c
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default VehicleForm;
