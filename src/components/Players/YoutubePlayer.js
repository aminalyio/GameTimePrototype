import React, { useCallback, useEffect, useRef } from 'react';
import './YoutubePlayer.css';
import YTLoader from 'youtube-iframe';
import {
  setClientToSdk,
  groupSeek,
  stopSync,
  startSynchronize,
  setGroup,
  attachDeltaListener,
  attachPlaybackRateListener,
} from 'services/SyncService';
import DemoYoutubePlayerDecorator from 'decorators/DemoYoutubePlayerDecorator';
import { useSelector } from 'react-redux';

const YoutubePlayer = ({ isLoggedIn, userId }) => {
  const cleanup = useRef(() => {});
  const { participants } = useSelector((state) => state.session);
  const { videoId } = useSelector((state) => state.participant);
  const videoIdRef = useRef(videoId);
  

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
    if (!player || !isLoggedIn) {
        return;
    }

    if (!isLoggedIn) {
      return;
    }


    player.playVideo();
    setClientToSdk(new DemoYoutubePlayerDecorator(player));

    player.setVolume(5);

    cleanup.current = () => {
      player.destroy();
    }

  }, [isLoggedIn]);

  useEffect(() => {
    YTLoader.load((YT) => {
        new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: videoIdRef.current,
            events: {
                onReady: (result) => {
                    handleReady(result.target);
                },
            },
            playerVars: {
                autoplay: true,
                rel: 0,
                showinfo: 0,
                ecver: 2,
                playsinline: 1,
                modestbranding: false,
            },
        });
    });

    return () => {
        cleanup.current();
    };
  }, [handleReady]);

  const showStats = participants.length > 0;

  return (
    <div className="player-container">
      {/* {showStats && ( */}
        <div className="sync-info">
          <div>
            Delta: <span id="delta-info"></span>
          </div>
          <div>
            Rate: <span id="rate-info"></span>
          </div>
        </div>
      {/* )} */}

      <div className="player" id="youtube-player" />
    </div>
  );
}
export default YoutubePlayer;

