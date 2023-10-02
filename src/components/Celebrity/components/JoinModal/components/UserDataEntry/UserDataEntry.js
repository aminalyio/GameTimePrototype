import React, { useRef, useCallback } from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WT from '@sscale/wtsdk';
import './UserDataEntry.css';

import { setRoomSettings } from 'store/reducers/CelebrityReducer';
import { setJoinModalType } from 'store/reducers/SessionReducer';
import celebrityAPI from 'services/celebrity';

function UserDataEntry() {
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    displayName: '',
    password: '',
    username: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoadingState] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [video, setVideo] = useState('');
  const [audio, setAudio] = useState('default');
  const [speaker, setSpeaker] = useState('default');
  const isFirefox = typeof InstallTrigger !== 'undefined';
  const isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === '[object SafariRemoteNotification]';
    })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

  const streamRef = useRef(null);

  const connectInitialDevices = async () => {
    try {
      const constraints = { audio: true, video: true };

      streamRef.current = await WT.doPreview(constraints);

      const videoElem = document.getElementById('video-preview');

      if ('srcObject' in videoElem) {
        videoElem.srcObject = streamRef.current;
      }
      videoElem.onloadedmetadata = function (e) {
        setVideoEnabled(true);
        videoElem.play();
      };
    } catch (error) {
      setVideoEnabled(false);
    }
  };

  const getDevices = async () => {
    try {
      await connectInitialDevices();

      const devices = await WT.getMediaDevices();

      setMediaList(devices);

      setVideo(devices.camera[0].value);

      if (isFirefox || isSafari) {
        setAudio(devices.microphone[0].value);
      }

      return devices;
    } catch (e) {
      console.log('error - getDevices', e.message);
    }
  };

  useEffect(() => {
    // const devices = WT.
    getDevices();
  }, []);

  const joinWithRole = useCallback(async () => {
    if (!userData.username || !userData.password) {
      return;
    }

    try {
      setLoadingState(true);

      await celebrityAPI.login(userData.username, userData.password);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track && track.stop());
      }

      // WT.setAudioConstraints(audio ? { deviceId: audio } : false);
      // WT.setVideoConstraints(video ? { deviceId: video } : false);

      const payload = {
        userName: userData.displayName,
        isCelebrity: true,
        constraints: {
          audio: audio ? { deviceId: audio } : false,
          video: video ? { deviceId: video } : false,
        },
      };
      dispatch(setRoomSettings(payload));

      dispatch(setJoinModalType(null));
    } catch (error) {
      setPasswordError('Wrong credentials');
    } finally {
      setLoadingState(false);
    }
  }, [dispatch, userData]);

  useEffect(() => {
    const listener = (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();

        joinWithRole();
      }
    };

    document.addEventListener('keypress', listener);

    return () => {
      document.removeEventListener('keypress', listener);
    };
  }, [joinWithRole]);

  function handleChange(e) {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  const handleDevice = async (event, type) => {
    const value = event.target.value;

    if (type === 'microphone') {
      changeAudioDevice(value);
    }

    if (type === 'camera') {
      changeVideoDevice(value);
    }

    if (type === 'speaker') {
      changeOutputDevice(value);
      setSpeaker(value);
    }
  };

  const changeVideoDevice = async (value) => {
    const video = document.getElementById('video-preview');

    streamRef.current = await WT.doPreview({
      video: { deviceId: { exact: value } },
      audio: true,
    });

    video.srcObject = streamRef.current;

    video.onloadedmetadata = function (e) {
      setVideo(value);
      video.play();
    };
  };

  const changeAudioDevice = async (value) => {
    const videoElem = document.getElementById('video-preview');

    if (isFirefox) {
      videoElem.srcObject.getTracks().forEach((track) => track.stop());
    }

    streamRef.current = await WT.doPreview({
      video: { deviceId: { exact: video } },
      audio: { deviceId: { exact: value } },
    });

    videoElem.srcObject = streamRef.current;

    // videoElem.srcObject.getAudioTracks()[0].enabled = audioEnabled

    videoElem.onloadedmetadata = function (e) {
      setAudio(value);
      videoElem.play();
    };
  };

  const changeOutputDevice = async (value) => {
    const videoElem = document.getElementById('video-preview');

    videoElem.setSinkId(value);
  };

  return (
    <div className="uda-container">
      <div>
        <div className="uda-video-preview-wrapper">
          <video id="video-preview" muted={true} />
        </div>
      </div>

      <div>
        <form>
          <div className="uda-input-container">
            <label htmlFor="video">Video source</label>

            <select name="video" id="video" onChange={(e) => handleDevice(e, 'camera')} value={video}>
              {mediaList?.camera &&
                mediaList?.camera?.map((c, i) => (
                  <option key={i} value={c.value}>
                    {c.label}
                  </option>
                ))}
            </select>
          </div>

          <div className="uda-input-container">
            <label htmlFor="audio">Audio source</label>

            <select name="audio" id="audio" onChange={(e) => handleDevice(e, 'microphone')} value={audio}>
              {mediaList?.microphone &&
                mediaList?.microphone?.map((m, i) => (
                  <option key={i} value={m.value}>
                    {m.label}
                  </option>
                ))}
            </select>
          </div>

          {/*{!isFirefox && !isSafari && (*/}
          {/*  <div className="uda-input-container">*/}
          {/*    <label htmlFor="speaker">Speakers</label>*/}

          {/*    <select name="speaker" id="speaker" onChange={(e) => handleDevice(e, 'speaker')} value={speaker}>*/}
          {/*      {mediaList?.speaker &&*/}
          {/*        mediaList?.speaker?.map((s, i) => (*/}
          {/*          <option key={i} value={s.value}>*/}
          {/*            {s.label}*/}
          {/*          </option>*/}
          {/*        ))}*/}
          {/*    </select>*/}
          {/*  </div>*/}
          {/*)}*/}

          {/*<div className="uda-input-container" style={{ marginTop: '16px' }}>*/}
          {/*  <input*/}
          {/*    className="uda-input"*/}
          {/*    name="displayName"*/}
          {/*    placeholder="Enter display name"*/}
          {/*    autoFocus={true}*/}
          {/*    value={userData.displayName}*/}
          {/*    onChange={handleChange}*/}
          {/*    id="displayName"*/}
          {/*  />*/}
          {/*</div>*/}

          <div className="uda-input-container">
            <input
              className="uda-input"
              name="username"
              placeholder="Enter username"
              value={userData.username}
              onChange={handleChange}
              id="username"
              autoComplete="off"
            />
          </div>

          <div className="uda-input-container">
            <input
              className="uda-input"
              name="password"
              placeholder="Enter password"
              type="password"
              value={userData.password}
              onChange={handleChange}
              onFocus={() => setPasswordError('')}
              id="password"
              autoComplete="off"
            />

            <div className="uda-input-error">{passwordError || ''}</div>
          </div>

          <div>
            <button
              type="button"
              className="button uda-button"
              onClick={joinWithRole}
              tabIndex={0}
              disabled={loading || !userData.username || !userData.password}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              ) : (
                <span>Log in</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserDataEntry;
