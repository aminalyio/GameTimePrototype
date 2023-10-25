import React, { useCallback, useEffect, useRef } from 'react';
import './DailymotionPlayer.css';
import {
  setClientToSdk,
  attachDeltaListener,
  attachPlaybackRateListener,
} from 'services/SyncService';
import { useSelector } from 'react-redux';
import { loadScript } from '../../utils/loadScript';
import DemoDailymotionDecorator from 'decorators/DemoDailymotionPlayerDecorator';
import { DAILYMOTION_PLAYER } from './SupportedPlayers';


const DailymotionPlayer = ({ isLoggedIn, userId }) => {
  const cleanup = useRef(() => {});
  const { participants } = useSelector((state) => state.session);
  const { videoId, playerId } = useSelector((state) => state.participant);
  const videoIdRef = useRef(videoId);
  const playerIdRef = useRef(playerId);

  const dailymotionElementId = "dailymotion-player";

  useEffect(() => {
    attachDeltaListener((delta) => {
      const el = document.getElementById('delta-info');
      el.innerText = `${delta / 1000} sec`;
    });

    attachPlaybackRateListener((rate) => {
      const el = document.getElementById('rate-info');
      el.innerText = Number(rate).toFixed(2);
    });
  }, []);

  const handleReady = useCallback((player) => {
    if (!player) {
      return;
    }

    player.play();
    setClientToSdk(new DemoDailymotionDecorator(player));

    player.setVolume(0.1);

    cleanup.current = () => {
      player.destroy();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // @ts-ignore
    window.loadInterval = null;
    // @ts-ignore
    window.player = null;

    const dmPlayerId = DAILYMOTION_PLAYER[playerIdRef.current];
    const dmLibrary = `https://geo.dailymotion.com/libs/player/${dmPlayerId}.js`;

    loadScript(dmLibrary, () => {
      window.dailymotion.createPlayer('dailymotion-player', {
        video: videoIdRef.current,
      })
      .then((player) => handleReady(player));
    });

  }, [handleReady])

  return (
    <div className="dailymotion-player-container">

        <div className="sync-info">
          <div>
            Delta: <span id="delta-info"></span>
          </div>
          <div>
            Rate: <span id="rate-info"></span>
          </div>
        </div>

      <div className="dailymotion-player" id={dailymotionElementId} />
    </div>

  );
}

export default DailymotionPlayer;