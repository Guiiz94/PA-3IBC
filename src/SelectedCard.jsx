import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import VanillaTilt from 'vanilla-tilt';
import car from './images/car.png'
import cardBg from './images/card-bg.jpg'


function Tilt(props) {
  const { options, ...rest } = props;
  const tilt = useRef(null);

  useEffect(() => {
    VanillaTilt.init(tilt.current, options);
  }, [options]);

  return <div ref={tilt} {...rest} />;
}

function SelectedCard(props) {

  const [selected, setSelected] = useState(props.selected)

  const [card, setCard] = useState(<div className="box"/>)

  const triggerCard = () => {
    setSelected(!selected)
    console.log(selected);
    setCard(selected == true ? (<Tilt className="box" options={options} />) : <div className="box" />)
  }
  /* 
  {
    reverse:           false,  // reverse the tilt direction
    max:               35,     // max tilt rotation (degrees)
    perspective:       1000,   // Transform perspective, the lower the more extreme the tilt gets.
    scale:             1,      // 2 = 200%, 1.5 = 150%, etc..
    speed:             300,    // Speed of the enter/exit transition
    transition:        true,   // Set a transition on enter/exit.
    axis:              null,   // What axis should be disabled. Can be X or Y.
    reset:             true,   // If the tilt effect has to be reset on exit.
    easing:            "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
    glare:             false,   // if it should have a "glare" effect
    "max-glare":       1,      // the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
    "glare-prerender": false   // false = VanillaTilt creates the glare elements for you, otherwise
                               // you need to add .js-tilt-glare>.js-tilt-glare-inner by yourself
} */
  const options = {
    scale: 1.2,
    speed: 1000,
    max: 20,
    easing: "cubic-bezier(.5,.02,0.5,2)",    // Easing on enter/exit.
    // glare: true,
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
      console.log(X, Y);
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
          <div className='card-layer1'/>
          <div className='card-layer2'/>
        </Tilt>
      </div>
    </>
  );
}

export default SelectedCard