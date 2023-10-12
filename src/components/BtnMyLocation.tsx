import {useContext} from 'react'
import { MapContext, PlacesContext } from '../context'
export const BtnMyLocation = () => {

    const {map, isMapReady} = useContext(MapContext)
    const {userLocation} = useContext(PlacesContext)

    const onClick = () => {
        if(!isMapReady) throw new Error("Map is not on list");
        if(!userLocation )throw new Error ("No user location")  

        map?.flyTo({
            zoom: 15,
            center: userLocation
        })
    }

  return (
    <button 
    className="btn btn-success"
    onClick={onClick}
    style={{
        position:'fixed',
        top: '20px',
        right: '20px',
        zIndex: 999
    }}
    >Pin My Location
    </button>
  )
}
