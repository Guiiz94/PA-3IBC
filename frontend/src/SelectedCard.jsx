import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import VanillaTilt from 'vanilla-tilt';
import car from './images/car.png'
import cardBg from './images/card-bg.jpg'
import Statistic from "./Statistic"


function Tilt(props) {
  const { options, ...rest } = props;
  const tilt = useRef(null);

  useEffect(() => {
    VanillaTilt.init(tilt.current, options);
  }, [options]);

  return <div ref={tilt} {...rest} />;
}

function SelectedCard({cardProps}) {

  // console.log(cardProps);

  const options = {
    scale: 1.2,
    speed: 1000,
    max: 20,
    easing: "cubic-bezier(.5,.02,0.5,2)",    // Easing on enter/exit.
    // glare: false,
    perspective: 1000
  };

  useEffect(() => {
    const card = document.querySelector('.card');
    let w = card.clientWidth;
    let h = card.clientHeight;
    let b = card.getBoundingClientRect();
    document.querySelector('.card').addEventListener('mousemove', e => {
      let X = (e.clientX - b.left) / w;
      let Y = (e.clientY - b.top) / h;
      let rX = -(X - 0.5) * 26;
      let rY = (Y - 0.5) * 26;
      let bgX = 40 + 20 * X;
      let bgY = 40 + 20 * Y;
      // console.log(X, Y);
      document.documentElement.style.setProperty("--x", 100 * X + "%");
      document.documentElement.style.setProperty("--y", 100 * Y + "%");
      document.documentElement.style.setProperty("--bg-x", bgX + "%");
      document.documentElement.style.setProperty("--bg-y", bgY + "%");
      document.documentElement.style.setProperty("--r-x", rX + "deg");
      document.documentElement.style.setProperty("--r-y", rY + "deg");
    });
    document.querySelector('.card').addEventListener('mouseleave', e => {
      const card = document.querySelector('.card');
      card.style.transition = 'all 0.5s ease';
      card.style.transform = 'rotateY(0deg) rotateX(0deg)';
      document.documentElement.style.removeProperty("--x");
      document.documentElement.style.removeProperty("--y");
      document.documentElement.style.removeProperty("--bg-x");
      document.documentElement.style.removeProperty("--bg-y");
      document.documentElement.style.removeProperty("--r-x");
      document.documentElement.style.removeProperty("--r-y");

    });
    document.querySelector('.card').addEventListener('mouseenter', e => {
      const card = document.querySelector('.card');
      card.style.transition = 'none';
    });
  }, []);

  return (
    <>
      <div className='selectedCard-wrapper'>
        <Tilt className="card" options={options}>
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
              {/* <Statistic name={"Speed"} value={values[0]}/>
              <Statistic name={"Acceleration"} value={values[1]}/>
              <Statistic name={"Maneuvrability"} value={values[2]}/> */}
              <Statistic name={"Speed"} value={Math.round(cardProps.speed / 10)}/>
              <Statistic name={"Acceleration"} value={Math.round(cardProps.acceleration / 10)}/>
              <Statistic name={"Maniability"} value={Math.round(cardProps.maniability / 10)}/>
            </div>
          </div>
          <div className='card-layer1'/>
          <div className='card-layer2'/>
        </Tilt>
      </div>
    </>
  );
}

export default SelectedCard