
import {  useEffect, useState } from "react"
import { useParams , useNavigate } from "react-router-dom"
import axios from "axios"
const defaultFormFields = {
  password: '',
  confirmPassword: '',
}

function PasswordReset() {
  /**
   * Extract oobCode from the URL.
   * Delete console.log in production.
   */
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState(false)
  const [formFields, setFormFields] = useState(defaultFormFields)
  const { password, confirmPassword } = formFields
  const [errorMessage, setErrorMessage] = useState('')
  const [isExpired, setExpired] = useState(false)
  const params = useParams()
  const iv = params.iv
  
  useEffect(()=>{
    axios.get('http://localhost:8081',{withCredentials:true})
    .then(res => {
      if(res.data.valid) {
        navigate('/map')
      }
    }).catch(err =>console.log(err));
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault()
      //check if contains UPPERCASE,lowercase and number in password
    try {
      if(password.length > 7 ) {
        if(/[A-Z]/.test(password)&&  /\d/.test(password)){
          if (password === confirmPassword) {
      axios.post(`http://localhost:8081/reset-password/${iv}/${password}`,iv)
      .then(res => {

        if(res.data === "Success"){
          setSuccessMessage(true)
        }else{
          console.log(res.data)
          setExpired(true)
        }
        })
      }else{
        setErrorMessage("Password not Match!")
      }
    }else{
      setErrorMessage("Password contains at least one  UPPERCASE, lowercase and Number!")
    }
  }else{
    setErrorMessage("Password at least 8 Character")
  }
  
    } catch (error) {
      console.log(error.message)        
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormFields({...formFields, [name]: value })
  }

  return(
    <div className="passreset-container">
      { isExpired ?   
          <div className="card d-flex card-reset">
            <div className="col input-col">
              <h3>This link is Expired...</h3>
            </div>
            <div className="col input-col">
              <button onClick={() => navigate('/')} 
                className="btn btn-link"
                type="button">
                  Go to the Login page
              </button>
            </div>
          </div>  :
        successMessage ?
          <div className="card d-flex card-reset">
          <div className="col input-col">
              <h3>Success! Your Password change successfully</h3>
            </div>
          <div className="col input-col">  
              <button onClick={() => navigate('/')} 
                className="btn btn-link backlink"
                type="button">
                  Go to the Login page
              </button>
          </div>
          
          </div> :
        <div className="card d-flex card-reset">
          <form onSubmit={handleSubmit} >
            <div className="col input-col">
              <span>Enter Your NEW Password</span>
            </div>
            <div className="col input-col">
            
              <input
                type="password"
                name="password"
                className="form-control"
                value={password}
                onChange={handleChange}
                placeholder="New Password"
                required
              />
            </div>
            <div className="col input-col">
      
              <input
                type='password'
                name='confirmPassword'
                className="form-control"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </div>
            <div className="col input-col">
              <em style={{color:'red'}}> {errorMessage}</em>
            </div>
                         
            <div className="col input-col">
              <input type="submit" className="btn btn-success" 
              value="Submit new Password"/>
            </div>
          </form>
        </div>
      }
    </div>
  )
}

export default PasswordReset
