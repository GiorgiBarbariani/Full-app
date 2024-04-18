import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Tab, Tabs } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        birthDate: '',
        gender: '',
        profilePhoto: null
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [tabValue, setTabValue] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (tabValue === 0) {
            setUserData({ ...userData, [name]: value });
        } else {
            setLoginData({ ...loginData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        if (tabValue === 0) { // Registration tab
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('email', userData.email);
            formData.append('password', userData.password);
            formData.append('birthDate', userData.birthDate);
            formData.append('gender', userData.gender);
            if (userData.profilePhoto) {
                formData.append('profilePhoto', userData.profilePhoto);
            }

            try {
                const response = await axios.post('http://localhost:5000/register', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response.data);
                // alert('User registered successfully!');
            } catch (error) {
                console.error('Registration failed:', error);
                alert('Registration failed!');
            }
        } else {
            e.preventDefault();
            // Handle login submission here
            try {
                const response = await axios.post('http://localhost:5000/login', loginData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(response.data);
                navigate('/account');
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // alert('Logged in successfully!');
            } catch (error) {
                console.error('Login failed:', error);
                alert('Login failed!');
            }
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    return (
        <Container component="main" maxWidth="xs">
            <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label="Регистрация" />
                <Tab label="Вход" />
            </Tabs>

            {tabValue === 0 && (
                <div>
                    <Typography component="h1" variant="h5">Регистрация</Typography>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Имя"
                            name="name"
                            autoFocus
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Пароль"
                            name="password"
                            type="password"
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Дата рождения"
                            name="birthDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Пол"
                            name="gender"
                            onChange={handleChange}
                        />
                        <input
                            accept="image/*"
                            type="file"
                            onChange={(e) => setUserData({ ...userData, profilePhoto: e.target.files[0] })}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Зарегистрироваться
                        </Button>
                    </form>
                </div>
            )}

            {tabValue === 1 && (
                <div>
                    <Typography component="h1" variant="h5">Вход</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            autoFocus
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Пароль"
                            name="password"
                            type="password"
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Войти
                        </Button>
                    </form>
                </div>
            )}
        </Container>
    )
}

export default Registration