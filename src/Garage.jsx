import Deck from "./Deck"
import SelectedCard from "./SelectedCard"
import './Garage.css'

const Garage = () => {
    return (
        <div className="garage">
            <div className='main-deck'>
                <SelectedCard/>
            </div>
            <div className='reserve'>
                <Deck length={6} />
            </div>
        </div>
    )
}

export default Garage