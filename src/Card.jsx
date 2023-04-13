import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import VanillaTilt from 'vanilla-tilt';
import car from './images/car.png'
import cardBg from './images/card-bg.jpg'
import Statistic from './Statistic';


function Card(props) {


    let values = [
        //Generate a random number between 3 and 10
        Math.floor(Math.random()*7 + 3),
        Math.floor(Math.random()*7 + 3),
        Math.floor(Math.random()*7 + 3)
        ]

  return (
    <>
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
              <p>Skills : </p>
              <Statistic name={"Speed"} value={values[0]}/>
              <Statistic name={"Acceleration"} value={values[1]}/>
              <Statistic name={"Maneuvrability"} value={values[2]}/>
            </div>
            </div>
        </div>
    </>
  );
}

export default Card
