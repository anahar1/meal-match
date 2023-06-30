import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLogout, userName }) => {
  const [click, setClick] = useState(false);

  const [refreshPage, setRefreshPage] = useState(false);

  const handleClick = () => {
    setClick(!click);
    setRefreshPage(true);
  };

  const closeMobileMenu = () => setClick(false);

  const closeMenu = () => setClick(false);

  useEffect(() => {
    if (refreshPage) {
      const timeout = setTimeout(() => {
        setRefreshPage(false);
        window.location.reload(); // Refresh the page
      }, 1500); // Wait for 5 seconds before refreshing

      return () => clearTimeout(timeout);
    }
  }, [refreshPage]);
  
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
              onClick={handleClick}
            >
              Matched It
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
