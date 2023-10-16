
import { useEffect, useState } from "react";
import axios from "axios";
import {Switch} from "antd"
import getDnD from "../context/map/MapProvider";
import { useNavigate } from "react-router-dom";
import {BeatLoader} from 'react-spinners'
import { formControlClasses } from "@mui/material";
export const TransactionForm = ({UserRoutePlace, UserRouteAddress, Distance, Duration, MinimumFare, Discount, Exceeding}) => {
  const dnd = getDnD();
  const [Fare, setFare] = useState(0)
  // const [MinimumFare, setMinimumFare] = useState(0)
  // const [Discount, setDiscount] = useState(0)
  // const [Exceeding, setExceeding] = useState(0)
  const [toggle, setToggle] = useState(false)
  const [userType ,setUserType] = useState('');
  const [checkUser, setUserToggle] = useState(false)

  const [FinalFare, setFinalFare] = useState(0)
  const navigate = useNavigate()
  const [values, setValues] = useState({
      UserPlace : '',
      UserAddress:'',
      UserRoutePlace:'',
      UserRouteAddress:'',
      PlateNum:'',
      Distance: 0,
      Duration: 0,
      NumberOfPassenger: 0,
      Fare: 0,
  })
  const options = [
    {value: 1},
    {value: 2},
    {value: 3},
    {value: 4}
  ];
  const [NumberOfPassenger, setSelectedOption] = useState(options[0].value);
  useEffect(()=>{
    axios.get(`https://taxicleserver.onrender.com`, {withCredentials:true} )
    .then(res => {
      if(res.data.fare) {
      setUserType(res.data.data)
      setValues({
        ...values,
        UserPlace: dnd.UserPlace,
        UserAddress: dnd.UserAdd,
        UserRoutePlace: UserRoutePlace,
        UserRouteAddress: UserRouteAddress,
        Distance: Distance, // Change to the desired value
        Duration: Duration, // Change to the desired value
        NumberOfPassenger: NumberOfPassenger,
        Fare: FinalFare, // Change to the desired value
      });
    }
    }).catch(error => console.error(error));

      if(Distance < 1) {
        console.log(MinimumFare)
        setFare(MinimumFare * NumberOfPassenger)
      }else{
        let Calculated = Distance - 1
        Calculated *= Exceeding;
        setFare(Calculated + MinimumFare * NumberOfPassenger)
      }
      if(userType === "driver") {
        setUserToggle(true)
      } 
      if(toggle === true) {
          setFinalFare(Math.floor((Fare - (Discount * NumberOfPassenger))*100) / 100)
      }else{
         setFinalFare(Math.floor(Fare * 100)/ 100)
      }
  })


  const checkDiscount = () => {
    setToggle(!toggle)
  }
  const selectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
  };
  
  const handleChange = (event) => {
    setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
}

  const handleSubmit = (event) => {
    event.preventDefault()
    axios.post(`https://taxicleserver.onrender.com/travel`,values, {withCredentials:true} )
    .then(res => { 
      if(res.data.Status === "Success"){
        navigate('/history')
      }
    })
  }
  return (
    <div className='form-container'>
        <form onSubmit={handleSubmit}>
            <h4 style={{fontSize:'16px'}}>{UserRouteAddress} </h4>
            <h4 style={{fontSize:'14px'}}>{Distance} meters</h4>
            <h4 style={{fontSize:'14px'}}>{Duration} minutes</h4>
            <h4 style={{fontSize:'16px'}}>The Fare is:  
              {MinimumFare &&
              Discount &&
              Exceeding &&
              FinalFare !== 0 ? 
              <strong>              
                {" " + FinalFare} 
              </strong>
              : 
              <strong>
              <BeatLoader margin={-1} size={12} color="#000000" />
              </strong>
              }
            {}</h4>
            {checkUser ?
            <div >
            <div className="form-floating d-flex">
              <div className="col">
              <select  onChange={selectChange} value={NumberOfPassenger} className="form-select" id="passenger" name="passenger" >
              {options.map(option => (
                <option value={option.value} key={option.value}>{option.value}</option>
                ))}
              </select>
              <label htmlFor="passenger" className="form-label">Passenger No.</label>
              </div>
            </div>
            <div className="col pb-4 mb-3">
            <div className="d-flex">
          <h4 style={{fontSize:'14px', padding:'5px 10px 10px 0'}}>Senior/Student/PWD</h4>
          <Switch style={{margin:'5px 0x 10px 10px' }}
          onClick={checkDiscount}/> 
          </div>
            <input type="submit" value="Go!" className="btn btn-success float-right" />
            </div>
          </div>
            :
            <div >
              <div className="form-floating d-flex">
                <div className="col">
                <select  onChange={selectChange} value={NumberOfPassenger} className="form-select" id="passenger" name="passenger" >
              {options.map(option => (
                <option value={option.value} key={option.value}>{option.value}</option>
                ))}
              </select>
                <label htmlFor="passenger" className="form-label">Passenger No.</label>
                </div>
                <div className="col">
                <input type="text" id="PlateNumber" name="PlateNumber" onChange={handleChange} style ={{paddingLeft: '10px'}} className="form-control" autoCorrect="false"/>
                <label htmlFor="PlateNumber" className="form-label">Plate Number</label>
                </div>
              </div>
              <div className="col pb-4 mb-3">
              <div className="d-flex">
            <h4 style={{fontSize:'14px', padding:'5px 10px 10px 0'}}>Senior/Student/PWD</h4>
            <Switch style={{margin:'5px 0x 10px 10px' }}
            onClick={checkDiscount}/> 
            </div>
              <input type="submit" value="Go!" className="btn btn-success float-right" />
              </div>
            </div>

            }

        </form>
    </div>
  )
}

export default TransactionForm
