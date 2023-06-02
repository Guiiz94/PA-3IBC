import { useEffect, useState } from 'react'
import Card from './Card'
import SelectedCard from "./SelectedCard"
import './Deck.css'
import CountdownTimer from './CountdownTimer'


const Deck = ({cars, resetCooldown}) => {
    // console.log(cars);
    const [selectedCard, setSelectedCard] = useState(null);
    const [visibleCard, setVisibleCard] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [rarityLabel, setRarityLabel] = useState(<></>);
    

    const highlightCard = (clickedCardProps, cards) => {
      setSelectedCard(clickedCardProps);
      console.log(clickedCardProps.rarity);
      switch(clickedCardProps.rarity){
        case "Relic":
            setRarityLabel(<div relic={"true"}>{clickedCardProps.rarity}</div>)
            break
        case "Legendary":
            setRarityLabel(<div legendary={"true"}>{clickedCardProps.rarity}</div>)
            break
        case "Mythic":
            setRarityLabel(<div mythic={"true"}>{clickedCardProps.rarity}</div>)
            break
        case "Rare":
            setRarityLabel(<div rare={"true"}>{clickedCardProps.rarity}</div>)
            break
        case "Uncommon":
            setRarityLabel(<div uncommon={"true"}>{clickedCardProps.rarity}</div>)
            break
        default:
            setRarityLabel(<div common={"true"}>{clickedCardProps.rarity}</div>)
            break
      }
      // console.log(clickedCardProps.readyTime * 1000);
      // console.log(new Date().getTime());
      // console.log(clickedCardProps.readyTime * 1000 <= new Date().getTime());
      const availabledCards = cards.filter(car => car !== clickedCardProps)
      const cardsArray = availabledCards.map((cardProps, index) => (
        <div
          key={index}
          className="card-wrapper"
          onClick={() => highlightCard(cardProps, cars)}
        >
          <Card
            speed={cardProps.speed}
            acceleration={cardProps.acceleration}
            maniability={cardProps.maniability}
            cooldown={(cardProps.readyTime * 1000) > new Date().getTime()}
          />
        </div>
      ));   
      setCards(cardsArray)
      setVisibleCard(true);
      setScrollY(window.scrollY);
      document.body.style.overflow = 'hidden'; // Disable scrolling
    };
  
    const closeCard = () => {
      const overlayElement = document.querySelector('.showcase');
      overlayElement.classList.add('closing');
      setRarityLabel(<></>)
    
      setTimeout(() => {
        setVisibleCard(false);
        document.body.style.overflow = 'auto'; // Réactiver le défilement
        setSelectedCard(null);
        const cardsArray = cars.map((cardProps, index) => (
          <div
            key={index}
            className="card-wrapper"
            onClick={() => highlightCard(cardProps, cars)}
          >
            <Card
              speed={cardProps.speed}
              acceleration={cardProps.acceleration}
              maniability={cardProps.maniability}
              cooldown={(cardProps.readyTime * 1000) > new Date().getTime()}
            />
          </div>
        ));   
        setCards(cardsArray)
      }, 500); // Attendre 0.5 seconde avant de réinitialiser la carte sélectionnée
    };
  
    useEffect(() => {
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);         

    const cardsArray = cars.map((cardProps, index) => (
      <div
        key={index}
        className="card-wrapper"
        onClick={() => highlightCard(cardProps, cars)}
      >
        <Card
          speed={cardProps.speed}
          acceleration={cardProps.acceleration}
          maniability={cardProps.maniability}
          cooldown={(cardProps.readyTime * 1000) > new Date().getTime()}
        />
        {/* <div className='cooldown-banner'>ON COOLDOWN</div> */}
      </div>
    ));   

    const [cards, setCards] = useState(cardsArray)

    return (
      <>
        {visibleCard && (
        <div
          className="showcase"
          style={{ top: `${scrollY}px` }}
          // onClick={closeCard}
        >
          <div className='overlay' onClick={closeCard}/>
          <div className="highlighted">
            <SelectedCard cardProps={selectedCard} />
            <div className='props-section'>
              {rarityLabel}
              <div>Speed : {selectedCard.speed}</div>
              <div>Acceleration : {selectedCard.acceleration}</div>
              <div>Maniability : {selectedCard.maniability}</div>
              <CountdownTimer readyTime={selectedCard.readyTime * 1000}/>
              {(selectedCard.readyTime * 1000) > new Date().getTime() ? <ResetCooldown resetCooldown={resetCooldown} id={selectedCard.id}/> : <></>}
            </div>
          </div>
        </div>
      )}
        <div className="deck">{cards}</div>
      </>
      );
      
}

function ResetCooldown({resetCooldown, id}){
  return(
    <>
      <form
        onSubmit={async (event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();
          resetCooldown(id);
        }}
      >
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="reset" />
        </div>
      </form>
    </>
  )
}

export default Deck