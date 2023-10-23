import { useContext, useRef, useEffect, useState } from 'react';
import { MapContext, PlacesContext } from "../context"
import { Loading } from './Loading';
import {  Map, Marker, Popup, accessToken } from 'mapbox-gl';
import getDnD from '../context/map/MapProvider';
import axios from 'axios';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {TransactionForm } from './TransactionForm'
import { directionsApi } from '../apis';
import { DirectionsResponse } from "../interfaces/directions";

type faredata = {
  MinimumFare: number | undefined,
  Discount: number | undefined,
  Exceeding: number | undefined
}
export const MapView = () => {
    const { isLoading, userLocation }= useContext( PlacesContext )
    const {map, setMap, getRouteBetweenPoints, lineremove} = useContext (MapContext)
    const [show, setShow] = useState(false);
    const mapDiv = useRef<HTMLDivElement>(null)
    const [Kilometer, setDistance] = useState<number | undefined>();
    const [minutes, setDuration] = useState<number | undefined>();
    const dnd = getDnD();
    const marker = new Marker()
    const [fareData, setFareData] = useState<faredata[]>([]);
    const [MinimumFare, setMinimumFare] = useState<number | null>()
    const [Discount, setDiscount] = useState<number | null>()
    const [Exceeding, setExceeding] = useState<number | null>()
    const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

    const handleClose = () => {
      lineremove()
      setShow(false); 
      markers.forEach((marker) => marker.remove());
      setMarkers([]);
    }
    const handleShow = () => {
      setShow(!show);
    }
    useEffect(()=> {
      axios.get(`https://taxicleserver.onrender.com`, {withCredentials:true} )
      .then(res => {
        if (res.data.fare){
          setFareData(res.data.fare)
          setMinimumFare(fareData[0]?.MinimumFare)
          setExceeding(fareData[0]?.Discount)
          setDiscount(fareData[0]?.Exceeding)
        }
      })
    },[fareData])

    useEffect(() => {
      if (map) {
      map.on('click', async function(e) {
        if(!userLocation) return
        const lngLatClick = e.lngLat;

          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLatClick.lng},${lngLatClick.lat}.json?access_token=${accessToken}`
          );
          const end = [lngLatClick.lng, lngLatClick.lat]
          getRouteBetweenPoints(userLocation,[lngLatClick.lng, lngLatClick.lat])
          const resp = await directionsApi.get<DirectionsResponse>(`/${userLocation.join(',')}; ${ end.join(',') }`);
          const {distance, duration} = resp.data.routes[0];
          let Kilometer = distance / 1000
          let kms = Math.round(Kilometer * 100) / 100; 
          setDistance(kms) 
          const minutes = Math.floor( duration / 60);
          dnd.minutes = minutes
          setDuration(minutes)
          const firstFeature = response.data.features[0];
          dnd.UserRoutePlace = firstFeature.text
          dnd.UserRouteAdd = firstFeature.place_name
          marker
          .setLngLat( lngLatClick )
          .addTo( map )
          new Popup()
          .setLngLat(lngLatClick)
          .setHTML(`<div onClick="${handleShow()}"> </div>`)   
        // dispatch({ type: 'newMarker', payload: markerPusher});  
        setMarkers([...markers, marker]);  
      });  
    }
      },[map])

    useEffect(() => {
      if (!isLoading) {
      axios.get(`https://taxicleserver.onrender.com/mapstyle`, {withCredentials:true} )
      .then(res => {
        if(res.data.style !== "light") {
          const map = new Map({
            container: mapDiv.current!, // container ID
            style: 'mapbox://styles/mapbox/satellite-streets-v12' , // style URL
            center: userLocation, // starting position [lng, lat]
            zoom: 15, 
            // starting zoom
            });
            setMap (map);
        }else{
          const map = new Map({
            container: mapDiv.current!, // container ID
            style: 'mapbox://styles/mapbox/light-v11' , // style URL
            center: userLocation, // starting position [lng, lat]
            zoom: 15, 
            // starting zoom
            });
            setMap (map);
        }
      }).catch(err =>console.log(err));
      }
      
      },
      [isLoading])

    if(isLoading) {
        return(<Loading />)
    }

  return (
    <div
     ref={mapDiv}
    style={{
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0, 
      left: 0,
    }}
    >
      {userLocation?.join(',')}
      <Offcanvas  show={show} onHide={handleClose}  placement={'bottom'} style={{ scroll: false, backdrop: false,}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{dnd.UserRoutePlace} </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='nav-offcanvas'>
            <TransactionForm 
            UserRoutePlace={dnd.UserRoutePlace} 
            UserRouteAddress={dnd.UserRouteAdd} 
            Distance={Kilometer} 
            Duration={minutes} 
            MinimumFare ={MinimumFare}
            Discount ={Discount}
            Exceeding ={Exceeding}
            />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}