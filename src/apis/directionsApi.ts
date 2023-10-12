import axios from 'axios'


 const directionsApi = axios.create({
    baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving',
    params: {
        alternatives: false,
        geometries:'geojson',
        language:'en',
        overview: 'simplified',
        steps: 'false',
        access_token:'pk.eyJ1IjoidGF4aWNsZWFwcCIsImEiOiJjbGxnYWk3MnIxOXpiM2hxeWc2NHg0aXl6In0.J1OyEP5qABjL8I3AAA-ueg',
    }
})

export default directionsApi