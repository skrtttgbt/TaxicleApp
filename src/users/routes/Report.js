import React, { useState, useEffect } from 'react';
import './css/Report.css';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
const Report = ({date, from, to, travelID}) => {
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [values, setValues] = useState({
    reportType: '',
    bodyNumber: '',
    reportDetails: '',
    IncidentDate: null,
    from: from,
    to: to,
    travelID: 0
  });
  const getDate = (data) => {
    return  moment(data).format('MMMM Do YYYY, dddd');
  };
  useEffect(() =>{
    values.IncidentDate = moment(date).format('YYYY-MM-DD')
    values.from = from
    values.to = to
    values.travelID= travelID
  },[values, to, from, date,travelID])

  const handleSubmit = (event) => {
    console.log(values)
    event.preventDefault();
    axios.post('https://taxicleserver.onrender.com/report',values, {withCredentials: true})
    .then((res) => {
      console.log(res.data)
      if(res.data.Status === 'Success'){
        setSuccess(true)
      }else{
        setFailed(true)
      }
    })
  };
  
  useEffect(() => {
    axios
      .get('https://taxicleserver.onrender.com', { withCredentials: true })
      .then((res) => {
        if (!res.data.valid) {
          navigate('/');
        }
      })
      .catch((err) => console.log(err));
  }, []);
    
  const handleChange = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

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
                    id='bodyNumber'
                    name='bodyNumber'
                    value={values.bodyNumber}
                    onChange={handleChange}
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
                    value={values.reportType}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select Type of Report</option>
                    <option value="complain" >Complain</option>
                    <option value="overcharge" selected>Overcharge</option>
                </select>
                </div>

                {values.reportType === 'overcharge' && (
                <div className='mb-3 overcharge-form'>
                    <label htmlFor='amount' className='form-label'>
                    Amount charged:
                    </label>
                    <input
                    className='form-control'
                    type='number'
                    id='reportDetails'
                    placeholder='Enter amount...'
                    min='0'
                    name='reportDetails'
                    value={values.reportDetails}
                    onChange={handleChange}
                    required
                    />
                </div>
                ) }
                {values.reportType === 'complain' && (
                <div className='mb-3 complain-form'>
                    <label htmlFor='reportDetails' className='form-label'>
                    Report Details:
                    </label>
                    <textarea
                    className='form-control'
                    id='reportDetails'
                    rows='4'
                    value={values.reportDetails}
                    name='reportDetails'
                    onChange={handleChange}
                    required
                    placeholder='Write your complaints here...'
                    ></textarea>
                </div>
                )}

            <button type='submit' className='btn btn-primary'>
                Submit Report
            </button>
        </form>
        <Toast bg='success' className='toast-card' style={{position:'absolute'}}  onClose={() => setSuccess(false)} show={success} delay={3000} autohide>
          <Toast.Body>You have been Successfully Report this Transcation</Toast.Body>
        </Toast>
        <Toast className='toast-card' bg='danger' style={{position:'absolute'}} onClose={() => setFailed(false)} show={failed} delay={3000} autohide>
          <Toast.Body>You have been Reported this Transaction</Toast.Body>
        </Toast>
    </div>
  );
};

export default Report;
