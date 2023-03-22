import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCog, faUser, faSignOutAlt, faBook, faFileArchive, faCartShopping, faUserEdit, faC } from '@fortawesome/free-solid-svg-icons';
// import logo from './logo.png';
import './SideNav.css';
import { BookStack } from '../inventory/BookStack';
import { AuthContext } from '../../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const NavBarAdmin = () => {

  const {user, logout} = useContext(AuthContext)

  const navigate = useNavigate();
  const onLogout = () =>{
    logout();
    navigate('/login',{replace:true})
  }
  return (
    <>
    <div className="sidenav">
      <div className="sidenav-logo">
        {/* <img src={logo} alt="Logo" /> */}
        <div className='row' style={{display:'flex', alignItems:'center'}}>
          <div className='col-7'><h4 style={{color:"white"}}>{user.name}</h4></div>
          <div className='col-5' style={{borderLeft: '0.5px solid white'}}><h6 style={{color:"white"}}>Admin</h6></div>
        </div>
      </div>
      <hr />
      <ul className="sidenav-menu">
        <li className="sidenav-item">
          <a href="/admin/stock">
            <FontAwesomeIcon icon={faHome} className="sidenav-icon" />
            Home
          </a>
        </li>
        <li className="sidenav-item">
          <a href="/admin/sales">
            <FontAwesomeIcon icon={faCartShopping} className="sidenav-icon" />
            Sales
          </a>
        </li>
        <li className="sidenav-item">
          <a href="/admin/requests">
            <FontAwesomeIcon icon={faFileArchive} className="sidenav-icon" />
            Requests
          </a>
        </li>
        <li className="sidenav-item">
          <a href="/admin/book">
            <FontAwesomeIcon icon={faBook} className="sidenav-icon" />
            New book
          </a>
        </li>
        <li className="sidenav-item">
          <a href="/admin/users">
            <FontAwesomeIcon icon={faUserEdit} className="sidenav-icon" />
            users
          </a>
        </li>
        <li className="sidenav-item">
          <a href="/admin/profile">
            <FontAwesomeIcon icon={faUser} className="sidenav-icon" />
            Profile
          </a>
        </li>
        <li className="sidenav-item">
          <a href="" onClick={onLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="sidenav-icon" />
            Logout
          </a>
        </li>
      </ul>
    </div>
    </>
  );
};

