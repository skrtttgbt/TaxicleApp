import React, { useState, ReactNode, useEffect, useContext } from 'react';
import light from '../../light.png'
import satellite from '../../Satellite.png'
import './MapStyle.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { create } from 'zustand';
import { MapContext } from "../../context"

const MapStyle = () => {
  const {map} = useContext (MapContext)
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

  useEffect(()=>{
    try{
      if(!map) return 
      map.setStyle('mapbox://styles/mapbox/' + mapstyle);
    }catch{
      if(!map) return 
      map.setStyle('mapbox://styles/mapbox/' + mapstyle);
    }

  },[mapstyle])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMapstyle(event.target.value)
    getStyle.style = event.target.value
}
  return (
    <div className='card-container'>
        <div className='row d-flex menu'>
            <div className='col card light'>
            <input 
                type="radio" name="mapstyle" 
                id="light" className="input-hidden" 
                value="light-v11"
                onChange={handleChange}/>
            <label htmlFor="light" >
                    <img src={light} alt="light" />
            </label>
              </div>
            <div className='col card satellite'>
            <input 
                type="radio" name="mapstyle" 
                id="satellite" className="input-hidden" 
                value="satellite-streets-v12"
                onChange={handleChange}/>
            <label htmlFor="satellite" >
                <img src={satellite} alt="light" />
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

