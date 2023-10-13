
import { useEffect, useState } from "react";
import axios from "axios";
import {Switch} from "antd"
import getDnD from "../context/map/MapProvider";
import { useNavigate } from "react-router-dom";

export const TransactionForm = ({UserRoutePlace, UserRouteAddress, Distance, Duration}) => {
  const [fareData ,setFareData]= useState([])
  const dnd = getDnD();
  const [Fare, setFare] = useState(0)
  const [MinimumFare, setMinimumFare] = useState(0)
  const [Discount, setDiscount] = useState(0)
  const [Exceeding, setExceeding] = useState(0)
  const [toggle, setToggle] = useState(false)
  const [userType ,setUserType] = useState('');
  const [checkUser, setUserToggle] = useState(false)
  const [NumberOfPassenger, setSelectedOption] = useState(1);
  const [FinalFare, setFinalFare] =useState(0)
  const navigate = useNavigate()
  const [calculating, setCalculating] = useState(true)
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

  useEffect(()=>{
    axios.get(`https://taxicleserver.onrender.com`, {withCredentials:true} )
    .then(res => {
      if(res.data.fare) {
      setFareData(res.data.fare)
      if(!fareData[0]?.MinimumFare) return
      if(!fareData[0]?.Discount) return
      if(!fareData[0]?.Exceeding) return
      setUserType(res.data.data)
      setMinimumFare(fareData[0]?.MinimumFare)
      setDiscount(fareData[0]?.Discount)
      setExceeding(fareData[0]?.Exceeding)
      if(!Distance) return
      if(Distance < 1) {
        setFare(MinimumFare * NumberOfPassenger)
      }else{
        let Calculated = Distance - 1
        Calculated *= Exceeding;
        setFare(Calculated + MinimumFare * NumberOfPassenger)

      }
      if(userType === "driver") {
        setUserToggle(true)
      } 
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
  })
  const checkDiscount = () => {
    setToggle(!toggle)
  }
  const selectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(parseInt(value));
    setCalculating(false)
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
  const calculateFare = () => {
    if(FinalFare !== 0){
      if(toggle === true) {
        setFinalFare(Math.floor((Fare - (Discount * NumberOfPassenger))*100) / 100)
      }else{
        setFinalFare(Math.floor(Fare * 100)/ 100)
      }
      setCalculating(false)
    }
    return FinalFare
  }
  return (
    <div className='form-container'>
        <form onSubmit={handleSubmit}>
            <h4 style={{fontSize:'16px'}}>{UserRouteAddress} </h4>
            <h4 style={{fontSize:'14px'}}>{Distance} meters</h4>
            <h4 style={{fontSize:'14px'}}>{Duration} minutes</h4>
            <h4 style={{fontSize:'16px'}}>The Fare is: <strong>
              {calculating ? "Calculating..."
              : calculateFare()
              }</strong></h4>
            {checkUser ?
            <div >
            <div className="form-floating d-flex">
              <div className="col">
              <select  onChange={selectChange} className="form-select" id="passenger" name="passenger" >
                <option value={1} selected>1</option>
                <option value={2} >2</option>
                <option value={3}>3</option>
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
                <select  onChange={selectChange} className="form-select" id="passenger" name="passenger" >
                  <option value={1} selected>1</option>
                  <option value={2} >2</option>
                  <option value={3}>3</option>
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
