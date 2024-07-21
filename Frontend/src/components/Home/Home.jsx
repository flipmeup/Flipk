import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import './Home.css';
import Products from '../Products/Products';

const Home = () => {
  const [minutes, setMinutes] = useState(14);
  const [seconds, setSeconds] = useState(34);
  const [imagesLoaded, setImagesLoaded] = useState(false); // State to track image loading

  useEffect(() => {
    let interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        if (minutes === 0 && seconds === 0) {
          clearInterval(interval);
          // Timer logic when countdown finishes (optional)
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, seconds]);

  // Format the timer to display minutes and seconds with leading zeros
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  useEffect(() => {
    const loadImage = () => {
      const imgPromises = ['/assets/logo/categories.jpg', '/assets/logo/banner.jpg', '/assets/logo/banner2.jpg'].map((image) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = image;
        });
      });

      Promise.all(imgPromises)
        .then(() => setImagesLoaded(true))
        .catch((error) => console.error('Error preloading images:', error));
    };

    loadImage();
  }, []);

  return (
    <main>
      <Navbar />
      {imagesLoaded && (
        <>
          <img src='/assets/logo/categories.jpg' alt='category' className='category'/>
          <img src='/assets/logo/banner.jpg' alt='category' className='banner'/>
          <div className='timer'>
            <div className='left'>
              <div className='upper'>
                Deal of the day
              </div>
              <div className='lower'>
                <i className="ri-timer-fill"></i>
                <div id='timer'>{formattedTime}</div>
              </div>
            </div>
            <div className='right'>
              <button id='sale' type='button'>SALE IS LIVE</button>
            </div>
          </div>
          <img src='/assets/logo/banner2.jpg' alt='category' className='banner'/>
          <Products/>
        </>
      )}
    </main>
  );
};

export default Home;
