import React from 'react';

//Just a simple footer. 

const Footer = () => {
  return (
    <footer className="footer the-footer d-flex justify-content-between align-items-center">
      <img src='/ppg_1.webp' alt="The Powerpuff Girls" className='logo' style={{ maxWidth: '400px', marginLeft: '100px'  }} />
      <div className="text-center flex-grow-1">
        <h4>CS 3750 Software Engineering II</h4>
      </div>
      <div>
      <img src='/ppg_text_white.png' alt="The Powerpuff Girls Text" className='logo' style={{ maxWidth: '400px', marginRight: '100px' }} />
      </div>
    </footer>
  );
};

export default Footer;