import { useEffect, useState } from "react";
import { BtnMyLocation, MapView, TaxicleLogo, NavBar } from "../components"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const HomeScreen = () => {
  const navigate = useNavigate()
  useEffect(()=>{
    axios.get('https://taxicleserver.onrender.com', {withCredentials:true})
    .then(res => {
      if(res.data.valid) {
        console.log("GG")
        navigate('/map')
      }else{
        console.log("GG")
        navigate('/')
      }
    }).catch(err =>console.log(err));
  },[])
  
  return (
    <div>
      <MapView  />
      <BtnMyLocation />
      <TaxicleLogo />
      <NavBar />
    </div>
  )
}

export default HomeScreen
