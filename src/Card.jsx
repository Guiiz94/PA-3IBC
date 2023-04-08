import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import VanillaTilt from 'vanilla-tilt';
import car from './images/car.png'
import cardBg from './images/card-bg.jpg'


function Card(props) {


  return (
    <>
      <div className='card-wrapper'>
        <div className="card">
            <img className='card-bg' src={cardBg}/>
            <div className='card-content'>
            <div className='card-title'>
                <h3>Lamborghini</h3>
            </div>
            <div className='img'>
                <img src={car}/>
            </div>
            <div className="card-body">
                <p>Caractéristiques : </p>
                <ul>
                <div class="caracteristique">
                    <li>300CV</li>
                    <li>Sportive</li>
                    <li>2 places</li>
                    <li>Propulsion</li>
                    <li>Pneu Sport</li>
                    <li>Frein Céramique</li>
                </div>
                </ul>
            </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default Card