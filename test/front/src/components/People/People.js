import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './people.css'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const People = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const user = localStorage?.getItem('user');
                if (user) {
                    setCurrentUser(JSON.parse(user));
                }
                const response = await axios.get('http://localhost:5000/users');
                // Filter out the current user
                setUsers(response.data.filter(user => user?._id !== currentUser?._id));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const calculateAge = (birthDate) => {
        const birthday = new Date(birthDate);
        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    return (
        <div className='users-container'>
            {users.map((user) => (
                <div key={user._id} className='user-card'>
                    
                    {user?.profilePhoto !== null && user?.profilePhoto?.includes('.jpg') && <img src={`http://localhost:5000/uploads/${user?.profilePhoto?.split('\\').pop()}`} alt="Profile" />}
                    <h3>{user.name}</h3>
                    <p>Возраст: {calculateAge(user.birthDate)}</p>
                </div>
            ))}
        </div>
    );
}

export default People
