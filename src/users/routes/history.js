import React, { useEffect, useState } from 'react'
import "./css/historyLog.css"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import testData from './testing' //for testing
import { CiSearch } from "react-icons/ci"; //search icon
import Report from './Report'
export default function TravelHistory() {
    const [History, setHistory] = useState([]);
    const navigate = useNavigate(); // fortesting

    const handleBack = () => {
        navigate('/map')
    }
    useEffect(()=>{
        axios.get('https://taxicleserver.onrender.com',{withCredentials:true})
        .then(res => {
          if(!res.data.valid) {
            navigate('/')
          }
        }).catch(err =>console.log(err));
      },[])
      useEffect(()=>{
        axios.get('https://taxicleserver.onrender.com/history',{withCredentials:true})
        .then(res => {
          if(res.data) {
            setHistory((res.data).sort((a, b) => b.idtravelhistory - a.idtravelhistory))
          }
        }).catch(err =>console.log(err))
      },[])

      const getDate = (data) => {
        return  moment(data).format('MMMM Do YYYY, dddd');
      };

      const [searchTerm, setSearchTerm] = useState(''); //for search to filter
      const filteredTestData = testData.filter((data) =>
        History.UserPlace.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const [showOffcanvas, setShowOffcanvas] = useState(false); //for report
      const [selectedTravelHistory, setSelectedTravelHistory] = useState(null); //to get the data of travel history

      const handleReportClick = (data) => {
        setSelectedTravelHistory(data);
        setShowOffcanvas(true);
      };

  return (
    <div className='history'>
        <div className="container-fluid " id="historyContainer">
            <nav className="navbar fixed-top header navhead">
                <div className="back-btn">
                    <button type="button" id="back-btn"  onClick={handleBack} className="btn btn-link">
                        <ion-icon name="arrow-back-outline" id="back-icon"></ion-icon>
                    </button>
                </div>
                <div className="title">
                    <h2>Travel History</h2>
                </div>
            </nav>
            <div className="timeline" >
                <div className='search-btn mb-3'>
                    <label htmlFor='searchBar'><CiSearch/></label>
                    <input className='form-control'
                        name='searchBar'
                        id='searchBar'
                        type='search'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ul className='ul-acc'>

                { filteredTestData.map((data, i) =>( 
                    
                    <li className='li-acc' key={i}>
                    <Accordion style={{background:'#097fd3'}}>
                        <AccordionSummary id="panel1a-content" aria-controls="panel1a-content">
                            <div id="li-btn" className="btn btn-link">
                            <div className="top">
                                <h6>{getDate(data.Date)}</h6>
                            </div>
                            <div className="row content">
                                <div className="col-12 d-flex mb-1">
                                    <span id="from">From:</span>
                                    <p>{data.UserPlace}</p>
                                </div>
                                <div className="col-12 d-flex">
                                    <span id="to">To:</span>
                                    <p>{data.UserRoutePlace}</p>
                                </div>
                            </div>
                            </div>
                        </AccordionSummary>
                        
                        <AccordionDetails className='collapse show' style={{padding:'0 0 10px'}}>
                            <div className="historyCard card">
                                <div className="card-container row d-flex mb-2" id="card-container2">
                                    <div className="col ">
                                        <label>Kilometers</label>
                                        <div id="content-card">
                                        <h5>{data.Distance} Km</h5>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <label className='ETT'>Estimated Time Traveled</label>
                                        <div id="content-card">
                                            <h5>{data.Duration} min</h5>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="card-container  row d-flex mb-2" id="card-container2">
                                    <div className="col ">
                                        <label>Fare</label>
                                        <div id="content-card">
                                        <h5>&#8369; {data.Fare}</h5>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <label className='numOfPass'>No. of Passenger</label>
                                        <div id="content-card">
                                            <h5>{data.NumberOfPassenger}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-container row d-block mb-2" id="card-container2">
                                    <div className="col report-btn">
                                        <button 
                                            type="button"
                                            className='btn btn-primary'
                                            onClick={() => handleReportClick(data)}>
                                            Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </AccordionDetails>
                        </Accordion>
                    </li>
                ))}
                </ul>
            </div>
        </div>
        {/* Offcanvas */}
      <div className={`offcanvas offcanvas-start ${
           showOffcanvas ? 'show' : ''
           }`}
           tabIndex="-1"
           id="offcanvas"
           aria-labelledby="offcanvasLabel">

        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasLabel">
            Do you have report?
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => setShowOffcanvas(false)}/>
        </div>
        <div className="offcanvas-body">
            {selectedTravelHistory && (
                <Report data={selectedTravelHistory} 
                        date={selectedTravelHistory.Date}
                        from={selectedTravelHistory.UserPlace}
                        to={selectedTravelHistory.UserRoutePlace}
            />)}
        </div>
      </div>
    </div>
  )
}

