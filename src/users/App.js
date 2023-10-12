import { Routes , Route, BrowserRouter } from 'react-router-dom' 
import Home from './routes/home'
import Register from './routes/register'
import ForgotPassword from './routes/forgotPassword'
import PasswordReset from './routes/passwordReset'
import MapApps from '../MapApps';
import UpdateUser from './routes/UpdateUser'
import TravelHistory from './routes/history'

function Apps() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path='/' element={ <Home />}>
        </Route>

        <Route path='/register' element={ <Register />}>
        </Route>

        <Route path='/map' element={ 
          <MapApps /> }>
        </Route>

        <Route path='/update-profile' element={ 
          <UpdateUser /> }>
        </Route>

        <Route path='/forgot-password' element={
          <ForgotPassword />}>
        </Route>

        <Route path='/reset-password/:iv' element= {
          <PasswordReset />}>
        </Route>

        <Route path='/history' element= {
          <TravelHistory />}>
        </Route>

      </Routes>

    </BrowserRouter>

  )
}

export default Apps
