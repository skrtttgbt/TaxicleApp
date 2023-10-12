import {useContext ,useState} from 'react'
import { MapContext, PlacesContext } from '../context'
import { LoadingPlaces } from './LoadingPlaces';
import { Feature } from '../interfaces/places';
import {TransactionForm } from './TransactionForm';
import Offcanvas from 'react-bootstrap/Offcanvas';
import getDnD from '../context/map/MapProvider';
import getInput from './SearchBar';
import { directionsApi } from '../apis';
import { DirectionsResponse } from '../interfaces/directions';


export const SearchResult = () => {
    const {places , isLoadingPlaces, userLocation } = useContext(PlacesContext)
    const { getRouteBetweenPoints, lineremove } = useContext(MapContext)
    const [show, setShow] = useState(false);
    const dnd = getDnD()
    const checkInput = getInput()
    const [Kilometer, setDistance] = useState<number | undefined>();
    const [minutes, setDuration] = useState<number | undefined>();
    const handleClose = () => {
        lineremove()
        setShow(false) ; 
    }  
    const getRoute = async ( place: Feature) => {
        if ( !userLocation ) return;
        checkInput.activeID = place.id
        const [lng, lat] = place.center;
        const end = [lng, lat]
          getRouteBetweenPoints(userLocation,[lng, lat])
          const resp = await directionsApi.get<DirectionsResponse>(`/${userLocation.join(',')}; ${ end.join(',') }`);
          const {distance, duration} = resp.data.routes[0];
          let Kilometer = distance / 1000
          const kms = Math.round(Kilometer * 100) / 100; 
          setDistance(kms) 
          const minutes = Math.floor( duration / 60);
          dnd.minutes = minutes
          setDuration(minutes)
        setShow((s) => !s);
        dnd.UserRoutePlace = place.text_en
        dnd.UserRouteAdd = place.place_name_en
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
    <Offcanvas  show={show} onHide={handleClose}  placement={'bottom'} style={{ scroll: false, backdrop: false,}} backdropClassName='offcanvas-nav'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{dnd.UserRoutePlace}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <TransactionForm 
            UserRoutePlace={dnd.UserRoutePlace} 
            UserRouteAddress={dnd.UserRouteAdd} 
            Distance={Kilometer} 
            Duration={minutes} />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

export default SearchResult
