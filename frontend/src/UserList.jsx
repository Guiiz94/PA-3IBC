import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5001/bdd/users/getUsers")
        .then(response => {
            setUsers(response.data)
        })
        .catch(err => console.error(err));
    }, []);

    return (
        <div>
            {users.map(user => (
                <div key={user._id} className="user">
                    <h2>{user.PseudoUser}</h2>
                    <p>{user.WalletUser}</p>
                    <p>XP: {user.XPUser}</p>
                    <p>Level: {user.LVLUser}</p>
                </div>
            ))}
        </div>
    );
}

export default UserList;