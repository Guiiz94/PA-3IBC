import { useState } from 'react'
import Card from './Card'
import './Deck.css'


const Deck = ({cars}) => {
    console.log(cars);
    let cardsArray = []
    const resetCards = () => {
        console.log(cardsArray);
        setCards(cardsArray)
    }

    for(let i = 0; i < cars.length; i++){
        cardsArray.push(
            <div key={i} className='card-wrapper'>
                <Card speed={cars[i].speed} acceleration={cars[i].acceleration} maniability={cars[i].maniability} onClick={resetCards}/>
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