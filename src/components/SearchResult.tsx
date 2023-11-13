import {useContext ,useEffect,useState} from 'react'
import { MapContext, PlacesContext } from '../context'
import { LoadingPlaces } from './LoadingPlaces';
import { Feature } from '../interfaces/places';
import {TransactionForm } from './TransactionForm';
import Offcanvas from 'react-bootstrap/Offcanvas';
import getDnD from '../context/map/MapProvider';
import getInput from './SearchBar';
import { directionsApi } from '../apis';
import { DirectionsResponse } from '../interfaces/directions';
import axios from 'axios';

type faredata = {
    MinimumFare: number | undefined,
    Discount: number | undefined,
    Exceeding: number | undefined
  }
export const SearchResult = () => {
    const {places , isLoadingPlaces, userLocation } = useContext(PlacesContext)
    const { getRouteBetweenPoints, lineremove } = useContext(MapContext)
    const [show, setShow] = useState(false);
    const dnd = getDnD()
    const checkInput = getInput()
    const [Kilometer, setDistance] = useState<number | undefined>();
    const [minutes, setDuration] = useState<number | undefined>();
    const [fareData, setFareData] = useState<faredata[]>([]);
    const [MinimumFare, setMinimumFare] = useState<number | null>()
    const [Discount, setDiscount] = useState<number | null>()
    const [Exceeding, setExceeding] = useState<number | null>()
    const handleClose = () => {
        lineremove()
        setShow(false) ; 
    }  
    useEffect(()=> {
      axios.get(`https://taxicleserver.onrender.com`, {withCredentials:true} )
      .then(res => {
        if (res.data.fare){
          setFareData(res.data.fare)
  
        }
      })
    },[fareData])

    const getRoute = async ( place: Feature) => {
        if ( !userLocation ) return;
        setMinimumFare(fareData[0]?.MinimumFare)
        setExceeding(fareData[0]?.Discount)
        setDiscount(fareData[0]?.Exceeding)
        checkInput.activeID = place.id
        const [lng, lat] = place.center;
        const end = [lng, lat]
          getRouteBetweenPoints(userLocation,[lng, lat])
          const resp = await directionsApi.get<DirectionsResponse>(`/${userLocation.join(',')}; ${ end.join(',') }`);
          const {distance, duration} = resp.data.routes[0];
          let Kilometer = distance / 1000
          const kms = Math.round(Kilometer * 100) / 100; // Formula  of  Kilometer
          setDistance(kms) 
          const minutes = Math.floor( duration / 60);
          dnd.minutes = minutes
          setDuration(minutes) // Formula  of Duration
        setShow((s) => !s)  //show TransactionForm
        dnd.UserRoutePlace = place.text_en
        dnd.UserRouteAdd = place.place_name_en
        console.log(dnd.UserRoutePlace,  dnd.UserRouteAdd,Kilometer,minutes,MinimumFare,Discount,Exceeding)
    }



    if( isLoadingPlaces ) {
        return (
            <LoadingPlaces />
        );
    }
    if(places.length === 0 ) {
        return (<> </>);
    } 
  return (
    <div className='search-result'>    
        <ul className="list-group mt-1">
        { 
            places.map( place => ( 
                <li
                key={place.id}
                className={`list-group-item list-group-item-action pointer ${( checkInput.activeID === place.id ) ? 'active' : ''}`}
            >
                <h6>{place.text_en}</h6>
                <p
                    style={{
                        fontSize:'12px'
                    }}
                >
                   {place.place_name}
                </p>
                <button 
                onClick={() => getRoute (place)}
                className={`routebtn btn btn-sm ${ checkInput.activeID === place.id ? 'btn-outline-light':'btn-primary' } ` }>
                    Direction
                </button>
            </li>
            )
        )}
    </ul>
    <Offcanvas show={show} onHide={handleClose}  placement={'bottom'}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{dnd.UserRoutePlace}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
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

export default SearchResult
