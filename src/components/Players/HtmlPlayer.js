import React, { useEffect } from 'react';
import Hls from 'hls.js';
import './HtmlPlayer.css';

import {
  setClientToSdk,
  groupSeek,
  stopSync,
  startSynchronize,
  setGroup,
  attachDeltaListener,
  attachPlaybackRateListener,
} from 'services/SyncService';
import HTMLPlayerDecorator from 'decorators/DemoHTMLPlayerDecorator';
import { useSelector } from 'react-redux';

const STREAM = 'https://demo-app.sceenic.co/football.m3u8';

const HtmlPlayer = ({ isLoggedIn }) => {
  const { syncToken } = useSelector((state) => state.celebrity);
  const { participants } = useSelector((state) => state.session);

  useEffect(() => {
    if (!syncToken) {
      return;
    }

    async function sync() {
      await setGroup(syncToken, 'Sceenic');
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
      el.innerText = `${delta}ms`;
    });

    attachPlaybackRateListener((rate) => {
      const el = document.getElementById('rate-info');
      el.innerText = Number(rate).toFixed(2);
    });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const stream = urlParams.get('stream') || STREAM;

    const video = document.getElementById('player');
    const hls = new Hls({});
    hls.attachMedia(video);

    hls.once(Hls.Events.MEDIA_ATTACHED, function () {
      hls.loadSource(stream);

      hls.once(Hls.Events.LEVEL_LOADED, function () {
        setClientToSdk(new HTMLPlayerDecorator({ video, hls }));
      });
    });

    video.volume = 0.05;

    window.player = hls;
    let firstSeek = true;
    video.addEventListener('seeked', (e) => {
      console.log('seeked');
      if (firstSeek) {
        firstSeek = false;
        return;
      }

      if (window.sdkSeek) {
        window.sdkSeek = false;
        return;
      }

      console.log('group seek');
      groupSeek();
    });

    return () => {
      hls.destroy();
    };
  }, [isLoggedIn]);

  const showStats = participants.length > 0;

  return (
    <div className="player-container">
      {showStats && (
        <div className="sync-info">
          <div>
            Delta: <span id="delta-info"></span>
          </div>
          <div>
            Rate: <span id="rate-info"></span>
          </div>
        </div>
      )}

      <video className="player" id="player" controls={true} autoPlay playsInline />
    </div>
  );
};
export default HtmlPlayer;
