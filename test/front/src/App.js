import React from 'react';
import Registration from './Registration';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AccountPage from './components/Account/AccountPage';
import People from './components/People/People';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/account" element={<AccountPage />}  />
        <Route path="/people" element={<People />}  />
        // Другие маршруты...
      </Routes>
    </Router>
    </>
  );
}

export default App;
