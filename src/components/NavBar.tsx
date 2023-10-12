import { useState, useEffect } from 'react';
import  { SearchBar } from './SearchBar';
import { FaRegUserCircle } from "react-icons/fa";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { SettingsBody }  from '../components/settings/settingsBody';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const NavBar = () => {
  const [name, setName] = useState('')
  const navigate = useNavigate()
  
  useEffect(()=>{
    axios.get('https://taxicleserver.onrender.com/', {withCredentials:true})
    .then(res => {
      if(res.data.valid) {

      }else{
        navigate('/')
      }
    }).catch(err =>console.log(err));

    axios.get(`https://taxicleserver.onrender.com/user`, {withCredentials:true})
    .then(res => {
      if(res.data.Result) {
        setName(res.data.FirstName+ " " + res.data.LastName)
      }else{
        navigate('/')
      }
    }).catch(err =>console.log(err));
  },[])

  const [isFloating, setIsFloating] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);   

  const onClickProfile = () => {
    setShow((s) => !s);
  }
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsFloating(true);
      } else {
        setIsFloating(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  
  return (
    <nav className={`navbar ${isFloating ? 'floating' : ''}`}>
      <div className="navbar-container">
        <SearchBar
        />
        <a className='userbtn' onClick={onClickProfile}><FaRegUserCircle/></a>
      </div>
      <Offcanvas show={show} onHide={handleClose} backdropClassName='ProfileForm' placement={'end'} style={{ scroll: false, backdrop: false}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><h4 style={{textTransform: 'capitalize'}}>{name}</h4></Offcanvas.Title>
        </Offcanvas.Header>
        <hr></hr>
        <Offcanvas.Body>
          <SettingsBody />
        </Offcanvas.Body>
      </Offcanvas>
    </nav>
  );
};

