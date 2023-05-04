import { useState } from 'react'
import Card from './Card'
import './Deck.css'


const Deck = (props) => {
    let cardsArray = []
    const resetCards = () => {
        console.log(cardsArray);
        setCards(cardsArray)
    }

    for(let i = 0; i < props.length; i++){
        cardsArray.push(
            <div key={i} className='card-wrapper'>
                <Card selected={true} onClick={resetCards}/>
            </div>
        )
    }

    const [cards, setCards] = useState(cardsArray)


    return (
        <>
            <div className='deck'>
                {cards}
            </div>
        </>
    )
}

export default Deck