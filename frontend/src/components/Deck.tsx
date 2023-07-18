import Card from "./Card";
import "../style/deck.scss";
import { Car } from "../dto";
import React from "react";

export interface DeckAttributes {
  collection: Car[];
  nftsId: number[];
  onRace:boolean[];
  submitFonction;
  onSale;
  prices?;
  timeouts?;
  speed?;
  maniability?;
  acceleration?;
  enterRace?;
}

const Deck = (attributes: DeckAttributes) => {
  // console.log(attributes);

  return (
    <div className="deck">
      {attributes.collection.map((card, index) => (
        <Card
          key={index}
          timeout={attributes.onSale ? Number(attributes.timeouts[index]) : 0}
          currentPrice={
            attributes.onSale ? Number(attributes.prices[index]) : 0
          }
          id={attributes.nftsId[index]}
          onSale={attributes.onSale}
          onRace={attributes.onRace.length > 0 ? attributes.onRace[index] : false}
          submitFonction={attributes.submitFonction}
          description={card.description}
          name={card.name as string}
          rarity_index={1}
          rarity={card.attributes[1].value}
          image_file={card.image as string}
          speed={card.attributes[2].value}
          acceleration={card.attributes[3].value}
          maniability={card.attributes[4].value}
          enterRace={attributes.enterRace}
          />
      ))}
    </div>
  );
};

export default Deck;
