import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCog, faUser, faSignOutAlt, faHistory } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
// import logo from './logo.png';
import './SideNav.css';
import { AuthContext } from '../../../auth/context/AuthContext';

export const NavBar = () => {

  const navigate = useNavigate();
  const onLogout = () =>{
    logout();
    navigate('/login',{
      replace:true
    })
  }

  const {user, logout} = useContext(AuthContext)

  return (
    <>
    <div className="sidenav">
      <div className="sidenav-logo">
        {/* <img src={logo} alt="Logo" /> */}
        <h4 style={{color:"white"}}>{user.name}</h4>
      </div>
      <hr />
      <ul className="sidenav-menu">
        <li className="sidenav-item">
          <a href="/user/stock">
            <FontAwesomeIcon icon={faHome} className="sidenav-icon" />
            Home
          </a>
        </li>
        <li className="sidenav-item">
          <a href="/user/history">
            <FontAwesomeIcon icon={faHistory} className="sidenav-icon" />
            History
          </a>
        </li>
        <li className="sidenav-item">
          <a href="/user/profile">
            <FontAwesomeIcon icon={faUser} className="sidenav-icon" />
            Profile
          </a>
        </li>
        <li className="sidenav-item">
          <a href='' onClick={onLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="sidenav-icon" />
            Logout
          </a>
        </li>
      </ul>
    </div>
    </>
  );
};

