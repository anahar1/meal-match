import React, { useState } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLogout, userName }) => {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className='navbar'>
        <Link to="#" className='navbar-logo' onClick={closeMobileMenu}>
          MealMatch
          <i class='fab fa-firstdraft' />
        </Link>
        <div className='menu-icon' onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>       
          <li className='nav-item'>
            <Link
              to='/createdate'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              Create Date
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/history'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              Restaurant Selection
            </Link>
          </li>
          <li className='nav-item1'>
              User ID: { userName }      
          </li>
        </ul>
        <Button onLogout={onLogout} />
      </nav>
    </>
  );
}

export default Navbar;
