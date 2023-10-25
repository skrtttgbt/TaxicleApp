import React, { useState, ReactNode, useEffect } from 'react';
import light from '../../light.png'
import satellite from '../../Satellite.png'
import './MapStyle.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { create } from 'zustand';

const MapStyle = () => {

  const [mapstyle, setMapstyle] = useState('')
  const [email, setEmail] = useState()
  const navigate = useNavigate()
  const getStyle = stylemap()
  useEffect(()=>{
    axios.get('https://taxicleserver.onrender.com', {withCredentials:true})
    .then(res => {
      if(res.data.valid) {
        setEmail(res.data.user)
      }else{
        navigate('/')
      }
    }).catch(err =>console.log(err));
  },[])
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setMapstyle(event.target.value)
    getStyle.style = mapstyle
}
  return (
    <div className='card-container'>
        <div className='row d-flex menu'>
            <div className='col card light'>
            <input 
                type="radio" name="mapstyle" 
                id="light-v11" className="input-hidden" 
                value="light-v11"
                onChange={handleChange}/>
            <label htmlFor="light-v11" >
                    <img src={light} alt="" />
            </label>
              </div>
            <div className='col card satellite'>
            <input 
                type="radio" name="mapstyle" 
                id="satellite-streets-v12" className="input-hidden" 
                value="satellite-streets"
                onChange={handleChange}/>
            <label htmlFor="satellite-streets" >
                <img src={satellite} alt="" />
            </label>
            </div>
        </div>
    </div>

  );
};

type DurationAndDistance = {
  style: string | undefined;
}

export const stylemap = create<DurationAndDistance>((set) =>
({
  style:"satellite-streets-v12",
  })); 

export default MapStyle;

