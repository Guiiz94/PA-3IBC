import Card from "./Card"
import '../style/deck.scss'
import { Car } from "../dto"
import React from "react"

export interface DeckAttributes{
    collection:Car[],
    nftsId:number[],
    submitFonction,
    onSale
}


const Deck = (attributes:DeckAttributes) => {

    // console.log(attributes);

    return (
        <div className="deck">
            {attributes.collection.map((card, index) =>(
                <Card key={index} id={attributes.nftsId[index]} onSale={attributes.onSale} submitFonction={attributes.submitFonction} description={card.description} name={card.name as string} rarity_index={1} rarity={card.attributes[1].value} image_file={card.image as string}/>
            ))}
        </div>
    )
}

export default Deck