import React from 'react';
import { useState } from 'react';
import participantQueueAPI from 'services/participant';

import './Login.css';

function Login({ onDone }) {
  const [uidValue, setUidValue] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleSubmit = async () => {
    if (!uidValue) {
      return;
    }

    try {
      setConnecting(true);

      // For demo purposes only, own auth solution should be implemented
      const data = await fetch(`https://chat.management.sceenic.co/token`, {
        method: 'POST',
        body: JSON.stringify({ user_id: uidValue }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => response.json());

      const token = data.token;
      participantQueueAPI.setToken(token);

      onDone();
      // setIsOpen(false);
      // setConnecting(false);
    } catch (e) {
      console.error('Connect failed,', e);
    }
  };

  return (
    <div className="login-container" id="login-container">
      <div className="login-card">
        <label className="uda-label">Enter User ID</label>
        <div className="uda-input-container">
          <input
            className="uda-input"
            name="user_id"
            placeholder="User ID"
            value={uidValue}
            onChange={(e) => {
              setUidValue(e.target.value);
            }}
            id="user_id"
            autoComplete="off"
          />
        </div>
        <button
          type="button"
          className="button uda-button"
          onClick={handleSubmit}
          tabIndex={0}
          disabled={!uidValue || connecting}
        >
          {connecting ? 'Loading' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

export default Login;
