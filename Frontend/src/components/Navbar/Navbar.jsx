  import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
<nav>
    <div className='upper'>
    <div className='leftNav'>
    <i className="ri-menu-line"></i>
    <img src="/assets/logo/logo.webp" alt='logo' />
    </div>
    <div className='rightNav'>
    <span id='counter'>1</span>
    <i className="ri-shopping-cart-2-fill"></i>
    </div></div>
    <div className='lower'>
        <input placeholder='Search for Products, Brands and More'></input>
    </div>
</nav>    
)
}

export default Navbar