import Deck from "./Deck"
import SelectedCard from "./SelectedCard"

const Garage = () => {
    return (
        <>
            <div className='main-deck'>
                <SelectedCard/>
            </div>
            <div className='reserve'>
                <Deck length={6} />
            </div>
        </>
    )
}

export default Garage