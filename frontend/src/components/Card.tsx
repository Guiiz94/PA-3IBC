import React, {useRef, useState, CSSProperties, useEffect, useLayoutEffect} from 'react';
import "../style/card.scss"
import VanillaTilt from 'vanilla-tilt';
import { gsap } from 'gsap';
import { Auction } from './Auction';
import CountdownTimer from '../CountdownTimer';

const CARD_WIDTH:string = "240px"

interface CardProps {
  id:number,
  name: string,
  rarity:string,
  image_file:string,
  rarity_index:number,
  description:string,
  submitFonction,
  onSale:boolean,
  onRace:boolean,
  currentPrice?,
  timeout?,
  speed?,
  acceleration?,
  maniability?,
  enterRace?

}


const Card:React.FC<CardProps> = ({id, name,rarity,image_file,rarity_index,description,submitFonction,onSale,onRace,currentPrice,timeout,speed,acceleration,maniability,enterRace}) => {
  
  // console.log(timeout);

  // console.log(enterRace);
  
  
  

    const cardOverlay = useRef<HTMLDivElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)
    const detailRef = useRef<HTMLDivElement>(null)
    const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0, visible:'hidden' });
    const [holoPosition, setHoloPosition] = useState({ x: 0, y: 0, visible:'hidden' });
    const [isSelected, setIsSelected] = useState(false);

    const handleMouseMove = (event:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if(cardRef.current){
            const cardRect = cardRef.current.getBoundingClientRect()
            let w = cardRef.current.clientWidth;
            let h = cardRef.current.clientHeight;
            const offsetX = (event.clientX - cardRect.left) / w;
            const offsetY = (event.clientY - cardRect.top) / h;
            const bgX = (event.clientX - cardRect.left) * 0.25;
            const bgY = (event.clientY - cardRect.top) * 0.25;
            setGlarePosition({ x: offsetX, y: offsetY, visible: 'visible' });
            setHoloPosition({ x: bgX, y: bgY, visible: 'visible' });
        }
    }

    const handleMouseLeave = () => {      
      setGlarePosition({ x: 0, y: 0, visible: 'hidden' });
      setHoloPosition({ x: 0, y: 0, visible: 'hidden' });
    }

    const glareStyle: CSSProperties & { [key: string]: string | number } = {
        '--x': `${glarePosition.x * 100}%`,
        '--y': `${glarePosition.y * 100}%`,
        visibility: glarePosition.visible as 'visible' |'hidden'
    };

    const holoStyles: CSSProperties & { [key: string]: string | number } = {
      '--background-x':`${holoPosition.x}%`,
      '--background-y':`${holoPosition.y}%`,
      '--x': `${glarePosition.x * 100}%`,
      '--y': `${glarePosition.y * 100}%`,
      visibility: glarePosition.visible as 'visible' |'hidden'
    };

  

  const options = {
    scale:1.1,
    speed: 1000,
    max: 30,
    transition:true,
    easing: "cubic-bezier(.03,.98,.52,.99)"
  };
  
  useEffect(() => {
    VanillaTilt.init(cardRef.current as HTMLDivElement, options);
  }, [options]);


  const getMask = (image:string) => {
    image = image.split('.')[0]
    image += "-mask.png"
    return image    
  }

  const handleSelectCard = ()=>{
    console.log("Statistiques :", { speed, acceleration, maniability });


    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    const cardRect = cardRef.current ? cardRef.current.getBoundingClientRect() : null;
    const left =cardRect? cardRect.left: 0
    const top =cardRect? cardRect.top: 0
    
    const cardWidth = cardRef.current != null ? cardRef.current.offsetWidth : 0;
    const cardHeight = cardRef.current != null ? cardRef.current.offsetHeight : 0;
    
    const centerX = windowWidth / 2 - cardWidth / 2 - left;
    const centerY = windowHeight / 2 - cardHeight / 2 - (top + window.scrollY);
    
    setIsSelected(!isSelected)
    if(!isSelected){
      document.body.style.position = "fixed"
      gsap.to(cardRef.current, {
        left: centerX,
        top: centerY,
        ease: 'power2',
        duration: 0.5,
        zIndex: '100',
      });
      gsap.to(cardOverlay.current, {
        opacity:0.95,
        zIndex:10,
        height:"200vh"
      });
      gsap.to(detailRef.current, {
        zIndex:15,
        left:centerX + 300,
        top: centerY,
        opacity: 1,
        width:'200%'
      });
    }else{
      document.body.style.position = "static"
      gsap.to(cardRef.current, {
        left: 0,
        top: 0,
        ease: 'power2',
        duration: 0.5,
        zIndex: '1',
      });
      gsap.to(cardOverlay.current, {
        opacity:0.0,
        zIndex:-1,
        height:"0"
      });
      gsap.to(detailRef.current, {
        opacity:0.0,
        left: 0,
        top: 0,
        zIndex:-1,
        width:"auto"
      });
    } 
  }


  return (
    <div style={{position:'relative'}}>
      <div 
      style={{width:CARD_WIDTH,minWidth:CARD_WIDTH}} 
      data-rarity={rarity.toLowerCase()} 
      ref={cardRef} 
      className='card' 
      onMouseLeave={handleMouseLeave} 
      onMouseMove={handleMouseMove} 
      onClick={handleSelectCard}>
        {onRace ? <div className='banner'>&nbsp;IN RACE</div> : <></>}
        <img src={`https://nftstorage.link/ipfs/${image_file.split('//')[1]}`} alt={name} width={CARD_WIDTH}/>
        {rarity.toLowerCase() != "common" ? <><div className='glare' style={glareStyle}/>
        <div className='holo shine' style={holoStyles}/></> : <></>}
        {rarity_index > 1 ? <img className='mask' src={`./assets/masks/${getMask(image_file)}`} width={CARD_WIDTH}/> : <></>}
      </div>
      <div style={{width:CARD_WIDTH}} ref={detailRef} className="card-detail">
      <hr style={{width:'100%'}}/>

        <h3>{name}</h3>

        <p>{description}</p>        
        {
          !onSale && !onRace &&
          <button onClick={() => enterRace(id, speed, acceleration, maniability)}>Entrer dans la course</button>
        }
        <hr style={{width:'100%'}}/>
        {
          onSale && timeout - Math.floor(Date.now() / 1000) > 0 &&
          <Auction id={id} onSubmit={submitFonction} onSale={onSale}/>
        }
        <p>ID: {id.toString()}</p>
        {onSale &&
          <>
            <p>Current Price : {currentPrice} FRT</p>
            <CountdownTimer readyTime={timeout}/>
          </>
        }
        {
          !onSale && !onRace &&
          <Auction id={id} onSubmit={submitFonction} onSale={onSale}/>
        }
                <hr style={{width:'100%'}}/>

      </div>      
      <div ref={cardOverlay} className="card-overlay"/>
    </div>
  );
};

export default Card;
