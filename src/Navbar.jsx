import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand" href="/">F-Race.pnj (logo sexy)</a>
        <hr className="my-4" />
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Accueil
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/connexion">
                Connexion
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/inscription">
                Inscription
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-4" />
      </div>
    </nav>
  );
};

export default Navbar;
