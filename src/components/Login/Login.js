import React from 'react';
import { useState } from 'react';
import participantQueueAPI from 'services/participant';

import './Login.css';
import { DEFAULT_PLAYER, PLAYERS } from 'components/Players/SupportedPlayers';
import { useDispatch } from 'react-redux';
import { setPlayerId, setRoomSettings, setVideoId } from 'store/reducers/ParticipantReducer';
import { getTokens } from 'services/tokens';


function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  console.log(result);

  return result;
}

function isRoomSettingDone(roomId, vid) {
  return vid || roomId;
}


function Login({ onDone }) {
  const dispatch = useDispatch();
  const [uidValue, setUidValue] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [vid, setVid] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(DEFAULT_PLAYER);
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('room');

  

  const handleSubmit = async () => {
    if (!uidValue) {
      return;
    }
    const curRoomId = roomId || makeid(10);

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

      const {
        wtToken,
        syncToken, 
        videoId,
        playerId
      } = await getTokens(curRoomId, selectedPlayer, vid);

      const payload = {
        syncToken,
        wtToken,
        videoId,
        roomId: curRoomId,
        playerId,
      }
      
      dispatch(setRoomSettings(payload));

      onDone(uidValue);

      // setIsOpen(false);
      // setConnecting(false);
    } catch (e) {
      console.error('Connect failed,', e);
    }
  };

  return (
    <div className="login-container" id="login-container">
      <div>
        <form className="login-card">
          <label className="uda-label">Enter User ID</label>
          <div className="uda-input-container" id="input-user-id">
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
          {roomId ? (
            <div></div>
          ) : (
            <div>
              <div className="uda-input-container"  id="input-player">
                <label className="uda-label">Stream Player</label>
                <select name = "player-selection" id="player-selection" onChange={(e) => setSelectedPlayer(e.target.value)} value={selectedPlayer}>
                {Object.keys(PLAYERS).map((player, i) => (
                    <option key={i} value={player.key}>
                        {player}
                    </option>
                    ))}
                </select>
              </div>

              <div className="uda-input-container"  id="input-video-id">
                <label className="uda-label">Enter Video ID</label>
                <input
                    className="uda-input"
                    name="video-id"
                    placeholder="Video ID"
                    value={vid}
                    onChange={(e) => {
                      setVid(e.target.value);
                    }}
                    id="video-id"
                    autoComplete="off"
                />
              </div>  
            </div>

          )}

          <button
            type="button"
            className="button uda-button"
            onClick={handleSubmit}
            tabIndex={0}
            disabled={!uidValue || !isRoomSettingDone(roomId, vid) || connecting}
          >
            {connecting ? 'Loading' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
