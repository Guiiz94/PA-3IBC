import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import VanillaTilt from 'vanilla-tilt';
import car from './images/car.png'
import cardBg from './images/card-bg.jpg'
import Statistic from './Statistic';


function Card({speed, acceleration, maniability, cooldown}) {


    // let values = [
    //     //Generate a random number between 3 and 10
    //     Math.floor(Math.random()*7 + 3),
    //     Math.floor(Math.random()*7 + 3),
    //     Math.floor(Math.random()*7 + 3)
    //     ]

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
              <Statistic name={"Speed"} value={Math.round(speed / 10)}/>
              <Statistic name={"Acceleration"} value={Math.round(acceleration / 10)}/>
              <Statistic name={"Maneuvrability"} value={Math.round(maniability / 10)}/>
            </div>
            </div>
        </div>
    </>
  );
}

export default Card
