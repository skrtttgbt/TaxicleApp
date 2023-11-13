
import {  useEffect, useState } from 'react'
import Logo from '../Images/Logo/taxicle.png'
import './css/home.css'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Agreement from './modal/Agreement'

export default function Home(){
  const [errorMessage, setErrorMessage] = useState('')
  const [values, setValues] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(()=>{
    //Check Session
    axios.get('https://taxicleserver.onrender.com', { withCredentials:true })
    .then(res => {
      if(res.data.valid) {
        navigate('/map')
      }else{
        navigate('/')
      }
    }).catch(err =>console.log(err));
  },[])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      // Login 
      axios.post('https://taxicleserver.onrender.com/login', values ,{ withCredentials:true })
      .then(res => {
        if(res.data.Login){
          navigate('/map')
        }else{
          setErrorMessage(res.data.message)
        }
      })
      .catch(err =>console.log(err));
    } catch (error) {
      console.log('User Sign In Failed', error.message);
    }
  };

  const handleChange = (event) => {
      // setting  up the values
      setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
  }

  return(
    <div className="home-container">
      <div className='row d-block'>
        <div className="col login-header">
          <img src={Logo} className="logo react" alt="logo" />
        </div>
        <div className="col home-wrapper">
            <div className='errormsg'>
              <em style={{color:'red'}}> {errorMessage}</em>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='row d-block form-item'>
                <div className="col">
                    <i className="fas fa-user"></i>
                    <input
                      type="email"
                      name="email"
                      className='form-control'
                      onChange={handleChange}
                      placeholder="Email"
                      required
                    />
                </div>
                <div className="col">
                  <i className="fas fa-lock"></i>
                  <input
                    type='password'
                    name='password'
                    className='form-control'
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="col forgetpass">
                  <a href="/forgot-password"><em>Forgot password?</em></a>
                </div>
                <div className="col button d-block">
                  <div className='subbtn'>
                    <input id='recaptcha' value="Login" type="submit" />
                  </div>
                  
                  <div className="signup-link d-block">
                    <div className='textSignup'>
                      <span>Don't have an account yet?</span>
                    </div>
                    <div className='signupBtn'>
                      <a href="#" onClick={handleShow} className='link-signup'>Signup now</a>
                    </div>
                  </div>
                </div>
              </div>
            </form>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions and Privacy Policy for Taxicle: Fare Matrix Application For Tarlac City</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Agreement/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" href='/register'>Understood</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

