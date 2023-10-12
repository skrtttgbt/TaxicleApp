import React, { useEffect, useState } from "react";
import MapStyle from "./MapStyle";
import DarkMode from "./DarkMode";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


export const  SettingsBody = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
    };
    const navigate = useNavigate()

  const handleLogOut = () => {
    axios.get('https://taxicleserver.onrender.com/logout' ,{withCredentials:true})
    .then(res=>{
        if(res.data.Status === "Success") {
            navigate('/')
        }
    }).catch(err => console.log(err))
  }
    return (
        <div className="body-container">
            <div className="row d-flex">
                <div className="col">
                    <ul className="menu">
                        <li>
                          <div className="d-flex dmode">
                                <h6 className="dmodetitle">Dark Mode</h6>
                                <DarkMode />
                          </div>
                        </li>
                        <li>
                            <a className="btn btn-link" id="li-btn" href="./update-profile">
                                <div className="top">
                                    <h6>Edit Profile</h6>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a className="btn btn-link" id="li-btn" href="./history">
                                <div className="top">
                                    <h6>Travel History</h6>
                                </div>
                            </a>
                        </li>
  
                        <li className="mb-0">
                            <div className="collapse-container">
                                <div className="collapse-header d-flex" onClick={toggleCollapse}>
                                    <h6>Type of Maps</h6>
                                    <span>{isCollapsed ? '▼' : '▲'}</span>
                                </div>
                            </div>
                        </li>
                        {!isCollapsed && 
                            <div className="collapse-content">
                                <MapStyle /> 
                            </div>}
                        <li>
                            <Link className="btn btn-link" id="log-btn" to="/" onClick={handleLogOut}>
                                <div className="logout">
                                    <h6>Log Out</h6>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SettingsBody;