import React from 'react';
import ReactDOM from 'react-dom/client';
import Apps from './users/App'

// import mapboxgl from 'mapbox-gl';
const mapboxgl = require('mapbox-gl');
 
mapboxgl.accessToken = 'pk.eyJ1IjoidGF4aWNsZWFwcCIsImEiOiJjbGxnYWk3MnIxOXpiM2hxeWc2NHg0aXl6In0.J1OyEP5qABjL8I3AAA-ueg';
if (!navigator.geolocation) {
  alert('No Geoloaction Option');
  throw new Error ('No Geoloaction Option');
}
const setDarkMode = () => {
  document.querySelector("body")?.setAttribute('data-theme', 'dark');
  localStorage.setItem("selectedTheme", "dark");

}
const selectedTheme = localStorage.getItem("selectedTheme");
if (selectedTheme === "dark") {
  setDarkMode();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Apps />    
  </React.StrictMode>
);
