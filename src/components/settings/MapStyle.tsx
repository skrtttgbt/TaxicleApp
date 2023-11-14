import React, { useState, useEffect, useContext } from 'react';
import light from '../../light.png'
import satellite from '../../Satellite.png'
import './MapStyle.css'
import { MapContext } from "../../context"

const MapStyle = () => {
  const {map} = useContext (MapContext)
  const [mapstyle, setMapstyle] = useState('')

  useEffect(()=>{
    // Change Mapstyle
      if(!map) return 
      if(mapstyle === '') return
      map.setStyle('mapbox://styles/mapbox/' + mapstyle);
  },[mapstyle])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMapstyle(event.target.value)
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

export default MapStyle;

