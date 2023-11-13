import { AnySourceData, LngLatBounds, Map, Marker, Popup, accessToken } from "mapbox-gl";
import { MapContext } from "./MapContext";
import { mapReducer } from "./mapReducer";
import { useContext, useEffect, useReducer } from "react";
import { PlacesContext } from "../";
import { directionsApi } from "../../apis";
import { DirectionsResponse } from "../../interfaces/directions";
import { create } from "zustand";
import getInput from "../../components/SearchBar";
import axios from "axios";

export interface MapState {
    isMapReady:boolean;
    map?: Map,
    markers: Marker[];
    AddMarkers: Marker[];
}

export const INITIAL_STATE = {
    isMapReady:false,
    map:undefined,
    markers: [],
    AddMarkers:[],
}

interface Props {
  children: JSX.Element | JSX.Element[]; 
}

export const MapProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE)
  const {places, userLocation } = useContext(PlacesContext);
  const inpLength = getInput()

  const dnd = getDnD();

    useEffect(() => {
      state.markers.forEach( marker => marker.remove() );
      const newMarkers: Marker[] = [];

      for (const place of places){
          const [lng, lat] = place.center;
          const popup = new Popup()
            .setHTML(`
              <h6>${place.text_en}</h6>
              <p>${place.place_name_en}</p>
            `);
            const newMarker = new Marker()
            .setPopup( popup )
            .setLngLat([lng, lat])
            .addTo(state.map!);
            
            newMarkers.push( newMarker);
      }
        dispatch({ type: 'setMarkers', payload: newMarkers});
    }, [places])

    const setMap = async ( map: Map ) => {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLocation}.json?access_token=${accessToken}`
      );
      const firstFeature = response.data.features[0];
      dnd.UserPlace =  firstFeature.text
      dnd.UserAdd = firstFeature.place_name
      const myLocationPopup = new Popup()
      .setHTML(`
      <h4> ${firstFeature.text} </h4>
      <p>${firstFeature.place_name} </p>
      `)
       new Marker({
        color:'#fb8561'
       })
       .setLngLat( map.getCenter() )
       .setPopup(myLocationPopup)
       .addTo( map );
       

      dispatch({ type: 'setMap', payload: map})
   }

    const getRouteBetweenPoints = async(start: [number, number], end: [number, number], ) => {

      const resp = await directionsApi.get<DirectionsResponse>(`/${start.join(',')}; ${ end.join(',') }`);
      
      const { geometry} = resp.data.routes[0];
      const { coordinates: coords  } = geometry;
      const bounds = new LngLatBounds(
        start,
        start
      ) 
        for (const coord of coords) {
          const newCoord: [number, number] = [coord[0], coord[1]]; 
          bounds.extend( newCoord );
        }
        state.map?.fitBounds( bounds, {
          padding: {
            top: 100,
            bottom: 350,
            left: 50,
            right: 50
         },
        })
        const sourceData: AnySourceData = {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: coords
                }
              }
            ]
          }
        }

        if (state.map?.getLayer('RouteString')) {
          state.map.removeLayer('RouteString');
          state.map.removeSource('RouteString');
        }

        state.map?.addSource('RouteString', sourceData)
        state.map?.addLayer({
          id: 'RouteString',
          type: 'line',
          source: 'RouteString',
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#496aff',
            'line-width': 8,
          }
          
        })

    }
    const lineremove = () => {
      if(inpLength.inputlng !== 0 && state.map?.getLayer('RouteString')){
        state.map.removeLayer('RouteString');
        state.map.removeSource('RouteString');
      }
      for(let place of places){
        if(inpLength.activeID !== place.id && state.map?.getLayer('RouteString')){
          state.map.removeLayer('RouteString');
          state.map.removeSource('RouteString');
        }
      }
    }
    
  return (
    <MapContext.Provider value={{
            ...state,

            setMap,
            getRouteBetweenPoints,
            lineremove,
            
            }}>
      {children}

    </MapContext.Provider>
  )
}
type DurationAndDistance = {
  kms: number | undefined;
  minutes: number | undefined;
  UserPlace: string | undefined;
  UserAdd: string | undefined;
  UserRoutePlace: string | undefined;
  UserRouteAdd: string | undefined;
}

const getDnD = create<DurationAndDistance>((set) =>
({
  kms:0,
  minutes:0,
  UserPlace:"",
  UserAdd:"",
  UserRoutePlace:"",
  UserRouteAdd:"",
  })); 

  export default getDnD

  