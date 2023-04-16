import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>F-Race</h5>
            <p>
              Le meilleur site pour échanger vos crypto-monnaies rapidement et en toute sécurité.
            </p>
          </div>
            <h5>Contactez-nous</h5>
            <p>Email : contact@f-race.com</p>
        </div>
        <div className="footer-bottom">
          <p>© 2023 F-Race. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;