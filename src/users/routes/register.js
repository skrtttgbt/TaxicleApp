
import { useEffect, useState } from 'react'
import Logo from '../Images/Logo/taxicle.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'

function Register () {
  
  const [showinput ,setshow] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  //values to Database
  const [values, setValues] = useState({
    FirstName:'',
    LastName: '',
    PhoneNumber: '',
    email: '',
    password: '',
    confirmPassword:'',
    UserType:'',
    plateNum:'',
    LicenseNum:'',
  })
  useEffect(()=>{
    axios.get('https://taxicleserver.onrender.com',{withCredentials:true})
    .then(res => {
      if(res.data.valid) {
        navigate('/map')
      }
    }).catch(err =>console.log(err));
  },[])

  //For passenger
  const handleShow = ()=>{
    setshow(false)
  }
  //For driver
  const handleClose = ()=>{
    setshow(true)
  }
  //When form submit
  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log(values.password.toString().length)
    if(values.password.toString().length > 8) {
    const emailparams = {
    email:values.email,
    name: values.FirstName + " " + values.LastName,
    message:  "This email is to confirm that your registration has been successfully completed.",
    }
  //   values.iv = encrypt;
      axios.post('https://taxicleserver.onrender.com/register', values, {withCredentials:true})
      .then(res => {
        if(res.data === "success") {
          emailjs.send('service_366snka', 'template_detdtfs', emailparams , 'p7D3wHU_XAzYaZECt')
        navigate('/')
        }else{
          setErrorMessage(res.data)
        }
    })
      .catch(err =>console.log(err));
    }else{
      setErrorMessage("Password Must be at least 8 character")
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
          <form onSubmit={handleSubmit}>
            <div className='row d-block item-container'>
              <div className="col">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  name="FirstName"
                  className='form-control'
                  onChange={handleChange}
                  placeholder="First Name"
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
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="col">
              <i className="fa fa-phone"></i>
                <input
                  type="tel"
                  name="PhoneNumber"
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
                  placeholder="Email"
                  required />
              </div>

              <div className="col">
                <i className="fa fa-lock"></i>
                <input
                  type="password"
                  name="password"
                  className='form-control'
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>

              <div className="col">
              <i className="fa fa-lock"></i>
                <input
                  type='password'
                  name='confirmPassword'

                  className='form-control'
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
              </div>

              <div className='col radio-btn'>
                <div className='row d-flex'>
                  <div className='col-12 typeOfUser'>
                    <span>Choose type of User</span>
                  </div>
                  <div className='col form-check'>
                    <input
                      type="radio"
                      name="UserType"
                      value="passenger"
                      id="passenger"
                      onChange={handleChange}
                      required
                      />
                      <label htmlFor="passenger" onClick={handleClose}>Passenger</label>
                  </div>

                  <div className='col form-check'>
                    <input
                      type="radio"
                      name="UserType"
                      value="driver"
                      id="driver"
                      onChange={handleChange}
                      required />
                    <label htmlFor="driver" onClick={handleShow}>Driver</label>
                  </div>

                </div>
              </div>

              { showinput ? 
                <>
                </>
                :
               <div className='AddInput'>
                  <div className="col form-floating mb-3">
                    <input
                      type="text"
                      name="LicenseNum"
                      id='licenseNum'
                      className='form-control'
                      onChange={handleChange}
                      placeholder="License Number"
                      required />
                      <label htmlFor='licenseNum'>License Number</label>
                  </div>
                  <div className="col form-floating mb-3">
                    <input
                      type='text'
                      name='PlateNum'
                      id='plateNum'
                      className='form-control'
                      onChange={handleChange}
                      placeholder="Plate Number"
                      required />
                      <label htmlFor='plateNum'> Plate Number</label>
                  </div>
              </div>
              }
              <div className="col button">
                <input type="submit" value='Register' className='btn btn-success'/>
                <p style={{color:"red"}}> {
                errorMessage} </p>
                <div className="signup-link"><a href="../">BackToLogin</a></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Register
