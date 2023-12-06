import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCog, faUser, faSignOutAlt, faUsers, faLaptop, faUserEdit, faHandHoldingHand } from '@fortawesome/free-solid-svg-icons';
// import logo from './logo.png';
import '../style/SideNav.css';
import { AuthContext } from '../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const NavBar = () => {

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
        <div className='row text-center' style={{display:'flex', alignItems:'center'}}>
          <div className='col-7'><h4 style={{color:"white",}}>{user.name}</h4></div>
          <div className='col-5' style={{borderLeft: '0.5px solid white'}}><h6 style={{color:"white"}}>Admin</h6></div>
        </div>
      </div>
      <hr />
      <ul className="sidenav-menu">
        <li className="sidenav-item">
          <a href="/admin/stock">
            <FontAwesomeIcon icon={faHome} className="sidenav-icon" />
            Principal
          </a>
        </li>
        <li className="sidenav-item">
          <a href="/admin/requests">
            <FontAwesomeIcon icon={faHandHoldingHand} className="sidenav-icon" />
            Solicitudes
          </a>
        </li>
        <li className="sidenav-item">
          <a href="/admin/device">
            <FontAwesomeIcon icon={faLaptop} className="sidenav-icon" />
            Dispositivos
          </a>
        </li>
        <li className="sidenav-item">
          <a href="/admin/users">
            <FontAwesomeIcon icon={faUsers} className="sidenav-icon" />
            Usuarios
          </a>
        </li>
        <li className="sidenav-item">
          <a href="/admin/profile">
            <FontAwesomeIcon icon={faUser} className="sidenav-icon" />
            Perfil
          </a>
        </li>
        <li className="sidenav-item">
          <a href="" onClick={onLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="sidenav-icon" />
            Cerrar sesión
          </a>
        </li>
      </ul>
    </div>
    </>
  );
};

