
import { useEffect, useRef, useState } from 'react';
import Logo from '../Images/Logo/taxicle.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Agreement from './modal/Agreement';
import { IoCameraSharp } from "react-icons/io5";

function Register () {
  const [showInput, setShowInput] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    UserType: '',
    MTOPID: '',
    plateNumID: '',
    LicenseNumID: '',
    imgMTOP: null,
    imgLicense: null,
    imgPlateNum: null,
    imgPassengerID: null,
  });
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const [step, setStep] = useState(1); //initial step
  const handleModalClose = () => setShowModal(false);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [passengerFileName, setPassengerFileName] = useState();
  const [MTOPFileName, setMTOPFileName] = useState();
  const [LicenseFileName, setLicenseFileName] = useState();
  const [PlateNumFileName, setPlateNumFileName] = useState();
 
  const handleNextStep = () => {
    if (step === 1 && (values.FirstName === '' || values.LastName === '' || values.PhoneNumber === '')) {
      setErrorMessage('Please complete all available forms.');
      return;
    } else if (step === 2) {
      if (values.UserType === '') {
        setErrorMessage('Please select a user type');
        return;
      }
      if (values.UserType === 'passenger' || (values.UserType === 'driver')) {
        setErrorMessage('');
        setStep((prevStep) => prevStep + 1);
      } else if (selectedUserType === 'driver' && !showInput && (values.LicenseNumID === '' || values.plateNumID === '')) {
        setErrorMessage('Please upload the pictures of these requirements');
        return;
      }
    } else if (step === 3 && (values.email === '' || values.password === '' || values.confirmPassword === '')) {
      setErrorMessage('Please fill all available forms');
      return;
    } else {
      setErrorMessage('');
      setStep((prevStep) => prevStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
    setErrorMessage('');
  };

  const handleShow = () => {
    setShowInput(false);
  }
  const handleClose = () => setShowInput(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(values)

      const formData = new FormData();
  
      formData.append('imgMTOP', values.imgMTOP);
      formData.append('imgPassengerID', values.imgPassengerID);
      formData.append('imgLicense', values.imgLicense);
      formData.append('imgPlateNum', values.imgPlateNum);

      console.log(formData)
      const emailParams = {
        email: values.email,
        name: `${values.FirstName} ${values.LastName}`,
        message: 'This email is to confirm that your registration has been successfully completed.',
      };

    if (values.password.toString().length > 8) {
      axios.post('https://taxicleserver.onrender.com/register', values, {withCredentials: true,})
        .then((res) => {
          if (res.data) {
            emailjs.send('service_366snka', 'template_detdtfs', emailParams, 'p7D3wHU_XAzYaZECt');
            formData.append('registeredEmail', res.data);
            if(values.imgMTOP != null){
              axios.post('https://taxicleserver.onrender.com/driversupload', formData, {withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
              .then((res1) => {
                if(res1.data === 'success') {
                navigate('/');
                }
              })
            }
            if(values.imgPassengerID != null){
              axios.post('https://taxicleserver.onrender.com/passengerupload', formData, {withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
              .then((res2) => {
                if(res2.data === 'success') {
                  navigate('/');
                  }
              })
            }
          } else {
            setErrorMessage(res.data);
          }
        })
        .catch((err) => console.log(err));
    }else {
      setErrorMessage('Password must be at least 8 characters');
    }
  }


  useEffect(() => {
    // Check Session
    axios
      .get('https://taxicleserver.onrender.com', { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          navigate('/map');
        }
      })
      .catch((err) => console.log(err));
  }, []);


  const handleChange = (event) => {
    if (event.target.name === 'UserType') {
      const userTypeValue = event.target.value;
      setSelectedUserType(userTypeValue);
      values.UserType = event.target.value
    }
  
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };


  const handleChangeUserType = (event) => {
    setSelectedUserType(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
      if (file) {
        const fileName = file.name;
        if (selectedUserType === 'driver') {
          if (event.target.name === 'MTOP') {
            setMTOPFileName(fileName);
            values.imgMTOP = file;
            console.log(values.imgMTOP)
          } else if (event.target.name === 'License') {
            setLicenseFileName(fileName);
            values.imgLicense = file;
          } else if (event.target.name === 'PlateNum') {
            setPlateNumFileName(fileName);
            values.imgPlateNum = file;
          }
        } else {
          setPassengerFileName(fileName);
          values.imgPassengerID = file
        }
      }
    };

  return (
    <div className="reg-container">
      <div className='row d-block'>
        <div className='col-12 logo-header'>
          <img src={Logo} className="logo react" alt="Taxicle Logo" />
        </div>
        <div className="col form-container">
          <form onSubmit={handleSubmit}>
            <div className="step-indicator">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className={`step-circle ${index + 1 === step ? 'current' : ''}`}
                  >{index + 1}</div>
                ))}
            </div>
            <div className='row d-block item-container'>
            {step === 1 && ( 
              <>
                <div className='step-title'>
                  <span>Step 1: Personal Information</span>
                </div>
                <div className="col">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    name="FirstName"
                    className='form-control'
                    onChange={handleChange}
                    value={values.FirstName}
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
                    value={values.LastName}
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
                    value={values.PhoneNumber}
                    placeholder="Phone Number(09 or +63)"
                    pattern="(09|\+639)\d{9}$" 
                    required
                  />
                </div>
                <div className='col errorMsg'>
                  <span className='col d-flex justify-content-center align-items-center'>{errorMessage}</span>
                </div>
                <div className="col button d-flex justify-content-end align-items-center">
                  <Button variant="primary" onClick={handleNextStep}>Next</Button>
                </div>
                <div className="col signup-link d-flex justify-content-center align-items-center">
                  <p>Do you have an account? <a href="../">Login here</a></p>
                </div>

              </>
            )}
              
            {step === 2 && (
              <>
                <div className='step-title'>
                  <span>Step 2: Type of user</span>
                </div>
                <div className='col radio-btn'>
                  <div className='row d-flex'>
                    <div className='col form-check'>
                      <input
                        type="radio"
                        name="UserType"
                        value='passenger'
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
                {values.UserType === 'driver' ? (
                  <div className='AddInput'>
                    <div className="col form-floating mb-3">
                        <div className='attachment-section'>
                            <span>Upload Picture of Motorized Tricycle Operator's Permit (MTOP): </span>
                            <input className='upload inputfile'
                              type="file"
                              capture="camera"
                              accept="image/*"
                              name="MTOP"
                              onChange={handleImageUpload}
                              value={values.MTOPID}
                              required
                              id="MTOP"
                            />
                            <label htmlFor="MTOP"><span><IoCameraSharp/> {MTOPFileName  || 'Choose a file...'}</span></label>
                        </div>
                      </div>
                      <div className="col form-floating mb-3">
                        <div className='attachment-section'>
                            <label htmlFor='LicenseNumID'>Enter License ID:</label>
                            <input className='form-control'
                              type="text"
                              name="LicenseNumID"
                              id="LicenseNumID"
                              placeholder='Enter your License Number...'
                              onChange={handleChange}
                              value={values.LicenseNumID}
                              required
                            />
                            <span>Upload Picture of License ID:</span>
                            <input className='upload inputfile'
                              type="file"
                              capture="camera"
                              accept="image/*"
                              name="License"
                              onChange={handleImageUpload}
                              required
                              id="License"
                            />
                            <label htmlFor="License"><span><IoCameraSharp/> {LicenseFileName  || 'Choose a file...'}</span></label>
                        </div>
                      </div>
                      <div className="col form-floating mb-3">
                        <div className='attachment-section'>
                            <label htmlFor='plateNumID'>Enter Plate Number:</label>
                            <input className='form-control'
                              type="text"
                              name="plateNumID"
                              id="plateNumID"
                              placeholder='Enter your Plate Number...'
                              onChange={handleChange}
                              value={values.plateNumID}
                              required
                            />
                            <span>Upload Picture of Plate Number:</span>
                            <input className='upload inputfile'
                              type="file"
                              capture="camera"
                              accept="image/*"
                              name="PlateNum"
                              onChange={handleImageUpload}
                              required
                              id="PlateNum"
                            />
                            <label htmlFor="PlateNum"><span><IoCameraSharp/> {PlateNumFileName  || 'Choose a file...'}</span></label>
                        </div>
                      </div>
                  </div>
                ) : (
                  <div className='d-flex justify-content-center p-0'>
                    <div className='typeOfPassenger'>
                      <div className='proof-section'>
                        <span>Select type of passenger:</span>
                        <select className='select-control'
                            name="userType"
                            value={selectedUserType}
                            onChange={handleChangeUserType}
                            required
                          >
                            <option value="" disabled>Select type</option>
                            <option value="ordinary">Ordinary Passenger</option>
                            <option value="student">Student</option>
                            <option value="pwd">PWD</option>
                            <option value="senior">Senior</option>
                        </select>
                        {['student', 'pwd', 'senior'].includes(selectedUserType) && (
                          <div className='attachment-section'>
                            <span>Upload Picture of ID:</span>
                            <input className='upload inputfile'
                              type="file"
                              capture="camera"
                              accept="image/*"
                              name="IdPicture"
                              onChange={handleImageUpload}
                              required
                              id="IdPicture"
                            />
                            <label htmlFor="IdPicture"><span><IoCameraSharp/> {passengerFileName  || 'Choose a file...'}</span></label>
                        </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
               <div className='col errorMsg'>
                  <span className='col d-flex justify-content-center align-items-center'>{errorMessage}</span>
                </div>
              <div className="col button d-flex justify-content-between">
                  <Button variant="secondary" onClick={handlePrevStep}>Previous</Button>
                  <Button variant="primary" onClick={handleNextStep}>Next</Button>
              </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className='step-title'>
                  <span>Step 3: Account Information</span>
                </div>
                <div className="col">
                  <i className="fa fa-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    className='form-control'
                    onChange={handleChange}
                    value={values.email}
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
                <div className='col errorMsg'>
                  <span className='col d-flex justify-content-center align-items-center'>{errorMessage}</span>
                </div>
                <div className="col button d-flex justify-content-between">
                  <Button variant="secondary" onClick={handlePrevStep}>Previous</Button>
                  <Button type="submit" value='Register' className='btn btn-success'>Register</Button>
                </div>
              </>
            )}
            </div>
          </form>
        </div>
        <Modal
          show={showModal}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Terms and Conditions and Privacy Policy for Taxicle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Agreement/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" href='/' >
              Disagree
            </Button>
            <Button variant="primary" onClick={handleModalClose}>I Agree</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}
export default Register;
