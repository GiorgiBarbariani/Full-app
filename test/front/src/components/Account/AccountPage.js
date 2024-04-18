import React, { useState, useEffect } from 'react';
import './account.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AccountPage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const goToPeople = () => {
        navigate('/people');
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);
    console.log('currentUser', currentUser)

    const profilePhotoPath = currentUser?.profilePhoto;
    const fileName = profilePhotoPath?.split('\\')?.pop();
    console.log('fileName', fileName)

    const [name, setName] = useState(currentUser?.name || '');
    const [password, setPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);

    const handleSave = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('password', password);
        if (profilePhoto) {
            formData.append('profilePhoto', profilePhoto);
        }
        try {
            const response = await axios.put(`http://localhost:5000/users/${currentUser._id}`, formData);
            if (response.data && response.data.user) {
                const updatedUser = response.data.user;
                const updatedFileName = updatedUser.profilePhoto?.split('\\').pop();

                setCurrentUser({
                    ...updatedUser,
                    profilePhoto: updatedUser.profilePhoto ? `http://localhost:5000/uploads/${updatedFileName}` : null
                });

                localStorage.setItem('user', JSON.stringify({
                    ...updatedUser,
                    profilePhoto: updatedUser.profilePhoto ? `http://localhost:5000/uploads/${updatedFileName}` : null
                }));

                setName('');
                setPassword('');
                setProfilePhoto(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!currentUser) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className='account-container'>
            <h1>Страница Пользователя</h1>
            <div className='account-info'>
                <img src={`${fileName}`} alt="Profile" />
                <div>
                    <p>Имя: {currentUser.name}</p>
                    <p>Email: {currentUser.email}</p>
                </div>


            </div>

            <form onSubmit={handleSave}>
                <label>Обновить имя</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
                <label>Обновить пароль</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <input type="file" id="file-upload" onChange={e => setProfilePhoto(e.target.files[0])} />
                <label htmlFor="file-upload">Choose File</label>
                <button type="submit">Save Changes</button>
            </form>
            <button onClick={goToPeople}>Все Пользователи</button>

        </div>
    );
}

export default AccountPage