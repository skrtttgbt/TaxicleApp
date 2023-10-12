import axios from 'axios'


 const searchApi = axios.create({
    baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    params: {
        limit: 5,
        language:'en',
        access_token:'pk.eyJ1IjoidGF4aWNsZWFwcCIsImEiOiJjbGxnYWk3MnIxOXpiM2hxeWc2NHg0aXl6In0.J1OyEP5qABjL8I3AAA-ueg',
        country: 'ph',
        autocomplete: true,
    }
})

export default searchApi