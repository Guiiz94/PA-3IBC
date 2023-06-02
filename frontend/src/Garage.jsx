import Deck from "./Deck"
import SelectedCard from "./SelectedCard"
import './Garage.css'
import Dapp from "./web3/Dapp"

const Garage = () => {
    return (
        <div className="garage">
            {/* <div className='main-deck'>
                <SelectedCard/>
            </div> */}
            <div className='reserve'>
                {/* <Deck length={6} /> */}
                <Dapp></Dapp>
            </div>
        </div>
    )
}

export default Garage