import React, { useState, ReactNode, useEffect } from 'react';
import light from '../../light.png'
import satellite from '../../Satellite.png'
import './MapStyle.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MapStyle = () => {

  const [values, setValues] = useState({
    mapstyle:'',
  })
  const [email, setEmail] = useState()
  const navigate = useNavigate()
  useEffect(()=>{
    axios.get('https://taxicleserver.onrender.com', {withCredentials:true})
    .then(res => {
      if(res.data.valid) {
        
      }else{
        navigate('/')
      }
    }).catch(err =>console.log(err));
  },[])
  
 const handleSubmit = (event:  React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
    axios.post(`https://taxicleserver.onrender.com/mapstyle/${values.mapstyle}`, {withCredentials:true} )
    .then(res => {
      if(res.data.style) {
        console.log(res.data.style)
      }else{
        console.log(res.data.style)
      }
    }).catch(err =>console.log(err));
 }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    console.log(values.mapstyle)
}
  return (
    <div className='card-container'>
      <form onSubmit={handleSubmit}>
        <div className='row d-flex'>
            <div className='col card light'>
            <input 
                type="radio" name="mapstyle" 
                id="light" className="input-hidden" 
                value="light"
                onChange={handleChange}/>
            <label htmlFor="light" >
                    <img src={light} alt="" />
            </label>
              </div>
            <div className='col card satellite'>
            <input 
                type="radio" name="mapstyle" 
                id="satelite" className="input-hidden" 
                value="satelite"
                onChange={handleChange}/>
            <label htmlFor="satelite" >
                <img src={satellite} alt="" />
            </label>
            </div>
        </div>
         <div className='row mt-3'>
        <div className='col card'>
        <input value="Save Changes" type="submit" className="btn btn-success"/>
          </div>
        </div> 
        </form>
    </div>

  );
};

export default MapStyle;

