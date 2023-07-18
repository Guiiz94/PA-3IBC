import React, { useState } from "react"

export const Auction = (props) => {

    const [price, setPrice] = useState(0)

    const handleChange = (event) => {
        setPrice(event.currentTarget.value)
    }

    const handleSubmit = async (event) => {
        props.onSubmit(props.id, price)
        // console.log(`Selling ${props.id} for ${price}`);
        
        event.preventDefault()
    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <input type="number" min={0} onChange={handleChange}/>
                <input type="submit" value={props.onSale ? "Buy" : "Sell"}/>
            </form>
        </>
    )
}