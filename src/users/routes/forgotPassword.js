
import {  useEffect, useState } from "react";
import Logo from '../Images/Logo/taxicle.png'
import emailjs from '@emailjs/browser'
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [emailMessage, setEmailMessage] = useState(false)
  const [email, setEmail] = useState({
      email: '' /*holder of email forgotten password */ ,
      iv:'' /*holder of Generated Code */
  })
  const navigate = useNavigate()
  useEffect(()=>{
      //  Session Checker
    axios.get('https://taxicleserver.onrender.com')
    .then(res => {
      if(res.data.valid) {
        navigate('/map')
      }
    }).catch(err =>console.log(err));
  },[])

  const [errorMessage, setErrorMessage] = useState() //  Variable of Error Message 

  const handleSubmit = async (e) => {
    e.preventDefault();
     email.iv = ''
     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (let i = 0; i < 25; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          email.iv += characters.charAt(randomIndex);
          }
    axios.post(`https://taxicleserver.onrender.com/forgot-password/${email.iv}`, email)
      .then(res => {
        console.log(res.data)
        if(res.data === "success"){
          console.log(email)
          const emailparams = {
            email: email.email,
            link: `https://taxicle-app.vercel.app/reset-password/${email.iv}`,
          }
          emailjs.send('service_366snka', 'template_lzfpmxl', emailparams , 'p7D3wHU_XAzYaZECt')
          setEmailMessage(true)
        }else{
          setErrorMessage(res.data)
        }
      })

      .catch(err =>console.log(err));
    try {
      
    } catch (error) {    
      if (error.code === 'auth/user-not-found') {
        alert('User not found, try again!')
        // setEmail('')
      }
    }
  };
    const handleChange = (event) => {
      setEmail(prev => ({...prev, [event.target.name]: [event.target.value]}))
  }
  return (
      <div className="fpass-container">
        <div className="row d-flex ">
          <div className="col-12 logo-header">
            <img src={Logo} className="logo react" alt="Taxicle Logo" />
          </div>
          <div className="col card">
            {
              emailMessage ?
              
              <div className="message">
                <h3>The Email has been sent; Check your Inbox!</h3>
                <div className="signup-link"><a href="../">Go Back To Login</a></div>
              </div>
              : 
              <form onSubmit={handleSubmit}>
                <div className="email">
                  <i className="fas fa-user"></i>
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@email.com"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
                <p style={{color:'red'}}> {errorMessage}</p>
                </div>
                <div className="buttons">
                  <input value="Reset my Password" type="submit" className="btn btn-success"/>
                  <div className="signup-link"><a href="../">Go Back To Login</a></div>
                </div>
              </form>
            }
          </div>
        </div>
      </div>

    
  )
}

export default ForgotPassword
