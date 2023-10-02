import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from 'components/Login/Login';
import Session from 'components/Session/Session';
import Celebrity from 'components/Celebrity/Celebrity';

const AppRouter = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  function handleDone() {
    setLoggedIn(true);
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={loggedIn ? <Session /> : <Login onDone={handleDone} />} />
        <Route path="/celebrity" element={<Celebrity />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
