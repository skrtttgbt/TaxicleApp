import React, { useEffect, useState } from 'react'
import "./css/historyLog.css"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
export default function TravelHistory() {
    const navigate = useNavigate()
    const [History, setHistory] = useState([])
    const [result, setResult] = useState([])
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
            setHistory(res.data)
          }
        }).catch(err =>console.log(err));
      },[])

      const getDate = (data, i) => {
        return  moment(data).format('MMMM Do YYYY, dddd');
      };

      useEffect(() =>{
        let datahistory = [...History]
        if(datahistory.length > 0 ) {
            datahistory.state.products.sort((a, b) => b.Date.localCompare(a.Date))
            setResult(datahistory)
        }
      },[History])

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
                <ul className='ul-acc'>

                { result.map((data, i) =>( 
                    
                    <li className='li-acc'>
                    <Accordion style={{background:'#097fd3'}}>
                        <AccordionSummary id="panel1a-content" aria-controls="panel1a-content">
                            <div id="li-btn" className="btn btn-link">
                            <div className="top">
                                <h6>{getDate(data.Date)}</h6>
                            </div>
                            <div className="row content">
                                <div className="col-12 d-flex mb-1">
                                    <span id="from">From:</span>
                                    <p>{data.UserAddress}</p>
                                </div>
                                <div className="col-12 d-flex">
                                    <span id="to">To:</span>
                                    <p>{data.UserRouteAddress}</p>
                                </div>
                            </div>
                            </div>
                        </AccordionSummary>
                        
                        <AccordionDetails className='collapse show' style={{padding:'0 0 10px'}}>
                            <div className="historyCard card">
                                <div className="card-container mb-2">
                                    <label>Place Name</label>
                                    <div className="row d-block" id="content-card">
                                        <div className="col-12 d-flex mb-1">
                                            <span id="lat">From:</span>
                                            <p>{data.UserPlace}</p>
                                        </div>
                                        <div className="col-12 d-flex">
                                            <span id="long">To:</span>
                                            <p>{data.UserRoutePlace}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-container row d-flex mb-2" id="card-container2">
                                    <div className="col ">
                                        <label>Kilometers</label>
                                        <div id="content-card">
                                           <h5>{data.Distance} Km</h5>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <label style={{fontSize:'12'}}>Traveled Time</label>
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
                                        <label>Plate Number</label>
                                        <div id="content-card">
                                            <h5>{data.PlateNum}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-container row d-block mb-2" id="card-container2">
                                    <div className="col">
                                        <label>No. of Passenger</label>
                                        <div id="content-card">
                                            <h5>{data.NumberOfPassenger}</h5>
                                        </div>
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
    </div>
  )
}

