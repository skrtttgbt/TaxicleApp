
import { useEffect, useState } from "react";
import axios from "axios";
import getDnD from "../context/map/MapProvider";
import { useNavigate } from "react-router-dom";
import {BeatLoader} from 'react-spinners'
export const TransactionForm = ({UserRoutePlace, UserRouteAddress, Distance, Duration, MinimumFare, Discount, Exceeding}) => {
  // from mapview and searchbar
  const dnd = getDnD();
  const [Fare, setFare] = useState(0)
  const [checkUser, setUserToggle] = useState(false)
  const [data, setData] = useState([])
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
      setData(res.data.data)
      }
    }).catch(error => console.error(error));
  },[])
  
  useEffect(()=>{
      if(Distance < 1) {
        if(NumberOfPassenger > 1) {
          setFare(((MinimumFare * NumberOfPassenger) - ((NumberOfPassenger - 1) * 5)))
        }else{
          setFare(MinimumFare * NumberOfPassenger)
        }
      }else{
        if(NumberOfPassenger > 1) {
          let Calculated = Distance - 1 // 1.6 - 1 
          Calculated *= Exceeding; // 0.6 * exceeding fare (5)
          setFare((Calculated * NumberOfPassenger) + ((MinimumFare  * NumberOfPassenger) - ((NumberOfPassenger - 1) * 5))) // 20 + 3 * 3 = 63 
        }else{
          let Calculated = Distance - 1 // 1.6 - 1 
          Calculated *= Exceeding; // 0.6 * exceeding fare (5)
          setFare(Calculated + MinimumFare * NumberOfPassenger) 
        }

      }
      if(data.UserType === "driver") {
        setUserToggle(true)
      } 
      if(data.imgPassengerID != null) {
          setFinalFare(Math.floor((Fare - (Discount * NumberOfPassenger))*100) / 100) //63 - ((15))
      }else{
         setFinalFare(Math.floor(Fare * 100)/ 100) //63.35
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
      })
  })
  const selectChange = (event) => {
    //Number of Passenger
    const value = event.target.value;
    setSelectedOption(value);
  };
  
  const handleChange = (event) => {
    //setting values
    setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
}

  const handleSubmit = (event) => {
    event.preventDefault()
    // to Travel History
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
            <h4 style={{fontSize:'14px'}}>{Distance} Kilometers</h4>
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
              <input type="submit" value="Go!" className="btn btn-success float-right" />
              </div>
            </div>
            }

        </form>
    </div>
  )
}

export default TransactionForm
