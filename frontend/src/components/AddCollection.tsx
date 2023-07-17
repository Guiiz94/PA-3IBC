import React, { useState } from "react"

export interface AddCollectionAttributes{
    addCollection
}

export const AddCollection = (attributes:AddCollectionAttributes) => {
    const [ipfs,setIpfs] = useState("")
    const [rarities,setRarities] = useState("")

    const handleIpfs = (event)=>{
        setIpfs(event.currentTarget.value)
    }
    const handlRarities = (event)=>{
        setRarities(event.currentTarget.value)
    }

    const handleSubmit = (event) => {
        if(ipfs != "" && rarities != "")attributes.addCollection(ipfs,rarities);
        event.preventDefault();
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="ipfs://bafybeidc6ue6xoaan2woze77bigbgvac4n7a64xozgixtau7oa6u75p5iu" onChange={handleIpfs}/>
                <input type="text" placeholder="21433232512454" onChange={handlRarities}/>
                <input type="submit" value="ADD"/>
            </form>
        </>
    )
}