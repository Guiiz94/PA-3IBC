import React from 'react';
import Navbar from './Navbar.jsx';
import demo_gif from './images/course.gif'
import './ErrorPage.css';

const ErrorPage = () => {
  const errorCode = new URLSearchParams(window.location.search).get("code");

  return (
    <>
     <Navbar />
    <div className="container mt-5 home-content">
      <div className="jumbotron">
        {/* <h1 className="display-4">{`ERREUR ${errorCode || "404"} - Page Not Found`}</h1> */}
        <h1 className="display-4">{`ERREUR 404 - Page Not Found`}</h1>
        <p className="lead">
          Erreur Rencontré !! 
        </p>
        <hr className="my-4" />
        <p>
          {/* <i>Une erreur est survenue</i> */}
        </p>
        <img className='gif-demo' src={demo_gif}/>
      </div>
    </div>
    </>
  );
};

export default ErrorPage;
