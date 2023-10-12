import { MapProvider, PlacesProvider } from "./context";
import HomeScreen from "./screens/HomeScreen";
import "./styles.css";
const MapApps = () => {
  return (
    <PlacesProvider>
      <MapProvider>
      <HomeScreen/>
      </MapProvider>
    </PlacesProvider>
  )
}

export default MapApps
