import { MapState } from './MapProvider'
import { Map, Marker  } from "mapbox-gl";
type MapAction = 
| {type:'setMap', payload: Map}
| {type:'setMarkers', payload: Marker[]}
| {type:'newMarker', payload: Marker[]}
| { type: 'RemoveMarkers'}
export const mapReducer = (state:MapState,action:MapAction):MapState => {

    switch(action.type) {
        case 'setMap':
            return {
                ...state,
                isMapReady:true,
                map: action.payload
            }

        case 'setMarkers':
            return {
                ...state,
                markers:action.payload
            }
            case 'RemoveMarkers':
      // Remove markers from the state
            return {
                ...state,
                markers: [],
            };
    default:
        return state;
    }

}