import { useNavigate } from 'react-router-dom';

function Utils(UserWallet) {
    const navigate = useNavigate();
    navigate("/inscription", {state: {userAddress: UserWallet}})
}

export default Utils;