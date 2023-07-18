import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="d-flex flex-column align-items-center">
          <div>
            <h5>F-Race</h5>
            <p>
            Vroum Vroum !
            </p>
          </div>
          <div>
            <h5>Contact us</h5>
            <p>Email : contact@f-race.com</p>
          </div>
          <div className="footer-bottom">
            <p>© 2023 F-Race. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
