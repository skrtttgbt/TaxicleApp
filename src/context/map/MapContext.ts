import { createContext } from "react";
//@ts-ignore
import { Map } from "!mapbox-gl";


 interface MapContextProps {
    isMapReady:boolean;
    map?: Map,

    setMap: (map: Map ) => void;
   getRouteBetweenPoints: (start: [number, number], end: [number, number]) => Promise<void>;
   lineremove: () => void;
  
   
 }



export const MapContext = createContext({} as MapContextProps );