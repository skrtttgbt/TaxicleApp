import React, { useState, useEffect } from 'react';
import './css/Report.css';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const Report = ({date, from, to}) => {
  const [reportType, setReportType] = useState('');
  const [bodyNumber, setBodyNumber] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const navigate = useNavigate()

  const getDate = (data) => {
    return  moment(data).format('MMMM Do YYYY, dddd');
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Report Type:', reportType);
    console.log('Body Number:', bodyNumber);
    console.log('Report Details:', reportDetails);
    console.log('Date:', getDate(date));
    console.log('From:', from);
    console.log('To:', to);
  };
  useEffect(() => {
    // Check Session
    axios
      .get('https://taxicleserver.onrender.com', { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          navigate('/map');
        }
      })
      .catch((err) => console.log(err));
  }, []);
  
  return (
    <div className='container report-container'>
        <form onSubmit={handleSubmit}>
            <div className='container d-flex'>
                <span><strong>Date:</strong> <em>{getDate(date)}</em></span>
                <span><strong>From:</strong> <em>{from}</em></span>
                <span><strong>To:</strong>  <em>{to}</em></span>
            </div>
            <div className='mb-3'>
                <label htmlFor='bodyNum' className='form-label'>
                    Tricycle Body Number:
                </label>
                <input
                    type='text'
                    className='form-control'
                    placeholder='Enter Body Number'
                    id='bodyNum'
                    name='bodyNum'
                    value={bodyNumber}
                    onChange={(e) => setBodyNumber(e.target.value)}
                    required
                />
            </div>
            <div className='mb-3 report-type'>
                <label htmlFor='reportType' className='form-label'>
                    Select type of report:
                </label>
                <select
                    className='form-control'
                    id='reportType'
                    name='reportType'
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    required>

                    <option value="" disabled>Select type</option>
                    <option value="complain">Complain</option>
                    <option value="overcharge">Overcharge</option>
                </select>
            </div>
            {reportType === 'complain' && (
            <div className='mb-3 complain-form'>
                <label htmlFor='reportDetails' className='form-label'>
                    Report Details:
                </label>
                <textarea
                className='form-control'
                id='reportDetails'
                rows='4'
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                required
                placeholder='Write your complaints here...'
                ></textarea>
            </div>
            )}
            {reportType === 'overcharge' && (
            <div className='mb-3 overcharge-form'>
                <label htmlFor='amount' className='form-label'>
                    Amount charged:
                </label>
                <input className='form-control'
                    type='number'
                    id='amount'
                    placeholder='Enter amount...'
                    min='0'
                    name='amount'
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    required />
            </div>
            )}
            <button type='submit' className='btn btn-primary'>
                Submit Report
            </button>
        </form>
    </div>
  );
};

export default Report;
