import React, { useCallback, useEffect, useRef } from 'react';
import './DailymotionPlayer.css';
import {
  setClientToSdk,
  groupSeek,
  stopSync,
  startSynchronize,
  setGroup,
  attachDeltaListener,
  attachPlaybackRateListener,
} from 'services/SyncService';
import { useSelector } from 'react-redux';
import { loadScript } from '../../utils/loadScript';
import DemoDailymotionDecorator from 'decorators/DemoDailymotionPlayerDecorator';


const DailymotionPlayer = ({ isLoggedIn, userId }) => {
  const cleanup = useRef(() => {});
  const { syncToken } = useSelector((state) => state.celebrity);
  const { participants } = useSelector((state) => state.session);
  const dailymotionElementId = "dailymotion-player";

  useEffect(() => {
    if (!syncToken) {
      return;
    }

    async function sync() {
      await setGroup(syncToken, userId);
      await startSynchronize();
    }

    sync();

    return () => {
      stopSync();
    };
  }, [syncToken]);

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
    console.log("add dailymotion player");

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

    loadScript("https://geo.dailymotion.com/player/xk9h6.js", () => {
      window.dailymotion.createPlayer('dailymotion-player', {
        video: 'x5gv5rr',
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