import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from 'components/Login/Login';
import Session from 'components/Session/Session';
import Celebrity from 'components/Celebrity/Celebrity';

const AppRouter = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState('')

  function handleDone(userId) {
    setLoggedIn(true);
    setUserId(userId);
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={loggedIn ? <Session userId={userId} /> : <Login onDone={handleDone} />} />
        <Route path="/celebrity" element={<Celebrity />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
