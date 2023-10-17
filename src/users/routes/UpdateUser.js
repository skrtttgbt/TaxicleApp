
import { useEffect, useState } from 'react'
import Logo from '../Images/Logo/taxicle.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function UpdateUser () {
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [FirstName, setFirstName] = useState('')
  const [LastName, setLastName] = useState('')
  const [PhoneNumber, setPhoneNumber] = useState('')
  const navigate = useNavigate()
  //values to Database
  const [values, setValues] = useState({
    FirstName:'',
    LastName: '',
    PhoneNumber: '',
    email: '',
    password: '',
    newpassword:'',
    confirmPassword:'',
  })
  
  useEffect(()=>{
    axios.get('https://taxicleserver.onrender.com',{withCredentials:true})
    .then(res => {
      if(res.data.user) {
        setEmail(res.data.user)
      }else{
        navigate('/')
      }
    }).catch(err =>console.log(err));
  },[])

  useEffect(()=>{
    axios.get(`https://taxicleserver.onrender.com/fetchdata/${email}`,{withCredentials:true})
    .then(res => {
      if(res.data.Result === "Success") {
        setOldPassword(res.data.password)
        setFirstName(res.data.FirstName)
        setLastName(res.data.LastName)
        setPhoneNumber(res.data.PhoneNumber)
      }
    }).catch(err =>console.log(err));
  })
  
  //When form submit
  const handleSubmit = async (event) => {
    event.preventDefault()
  //check if contains 8 Character password
if(values.password.toString().length > 7 ){
  //check if password is match to confirmapassword
    if(values.password.toString() === oldPassword && values.confirmPassword.toString() === values.newpassword.toString()){
        if(values.FirstName.toString() === ''){
            values.FirstName = FirstName
        }
        if(values.LastName.toString() === ''){
            values.LastName = LastName
        }
        if(values.PhoneNumber.toString() === ''){
            values.PhoneNumber = PhoneNumber
        }
    axios.post(`https://taxicleserver.onrender.com/userupdate/${email}`, values)
    .then(res => {
      if(res.data === "Success") {
      navigate('/map')
      }else{
        setErrorMessage(res.data)
      }
  }).catch(err =>console.log(err));
      }else{
        setErrorMessage("Password is not Match!")
      }
    }else{
      setErrorMessage("Password contains at least 8 Character")
    }
    try {

    } catch (error) {
      console.log('User Sign In Failed', error.message);
    }
  };

  const handleChange = (event) => {
      setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
  }

  return (
    <div className="reg-container">
      <div className='row d-block'>
        <div className='col-12 logo-header'>
          <img src={Logo} className="logo react" alt="Taxicle Logo" />
        </div>
        <div className="col form-container">
            <div className='errormsg'>
                <em style={{color:"red"}}> {
                    errorMessage} </em>
            </div>
          <form onSubmit={handleSubmit}>
            <div className='row d-block item-container'>
              <div className="col">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  name="FirstName"
                  className='form-control'
                  onChange={handleChange}
                  placeholder='First Name'
                  defaultValue={FirstName}
                  required
                />
              </div>
              <div className="col">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  name="LastName"
                  className='form-control'
                  onChange={handleChange}
                  placeholder='Last Name'
                  defaultValue={LastName}
                  required
                />
              </div>
              <div className="col">
              <i className="fa fa-phone"></i>
                <input
                  type="text"
                  name="PhoneNumber"
                  defaultValue={PhoneNumber}
                  className='form-control'
                  onChange={handleChange}
                  placeholder="Phone Number(09 or +63)"
                  pattern="(09|\+639)\d{9}$" 
                  required
                />
              </div>
              <div className="col">
                <i className="fa fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  className='form-control'
                  onChange={handleChange}
                  value={email}
                  placeholder="Email"
                  disabled />
              </div>
              <div className="col">
                <i className="fa fa-lock"></i>
                <input
                  type='password'
                  name='password'

                  className='form-control'
                  onChange={handleChange}
                  placeholder="Current Password"
                  required
                />
              </div>

              <div className="col">
                <i className="fa fa-lock"></i>
                <input
                  type='password'
                  name='newpassword'
                  className='form-control'
                  onChange={handleChange}
                  placeholder="New Password"
                  
                />
              </div>

              <div className="col">
              <i className="fa fa-lock"></i>
                <input
                  type='password'
                  name='confirmPassword'
                  className='form-control'
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                  
                />
              </div>
              <div className="col button">
                <input type="submit" value='Update Profile' className='btn btn-success'id="liveToastBtn" />
     
                <div id="liveToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                    <img src="..." class="rounded me-2" alt="..." />
                    <strong class="me-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                    Hello, world! This is a toast message.
                    </div>
                </div>
                <div className="signup-link"><a href="/map">Go Back</a></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default UpdateUser
