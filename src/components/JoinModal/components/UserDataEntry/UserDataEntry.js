import React, { useRef, useCallback } from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WT from '@sscale/wtsdk';
import './UserDataEntry.css';

import { setRoomSettings } from '../../../../store/reducers/ParticipantReducer';
import { setJoinModalType } from '../../../../store/reducers/SessionReducer';
import { setGroup, startSynchronize } from 'services/SyncService';
import {getTokens} from 'services/tokens';
// import participantAPI from 'services/participant';

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function UserDataEntry() {
  const dispatch = useDispatch();

  const [loading, setLoadingState] = useState(true);
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
    } catch (e) {
      console.log('error - getDevices', e.message);
    }
    setLoadingState(false);
  };

  useEffect(() => {
    // const devices = WT.
    getDevices();
  }, []);

  const joinWithRole = async () => {
    // if (!userData.email || !userData.password || !userData.displayName) {
    //   return;
    // }

    try {
      setLoadingState(true);

      const constraints = {
        audio: audio ? { deviceId: audio } : false,
        video: video ? { deviceId: video } : false,
      };

      const urlParams = new URLSearchParams(window.location.search);
      const roomId = urlParams.get('room') || makeid(10);

      const {wtToken, syncToken} = await getTokens(roomId);

      await setGroup(syncToken, 'Sceenic');
      await startSynchronize();

      await WT.Session.connect(wtToken, 'Sceenic', constraints);
      console.log('after connect');

      // participantAPI.setToken(wtToken);

      // await setInMemorySessionPersistence();
      // await signInWithEmailAndPassword(userData.email, userData.password);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track && track.stop());
      }

      // WT.setAudioConstraints(audio ? { deviceId: audio } : false);
      // WT.setVideoConstraints(video ? { deviceId: video } : false);

      const payload = {
        // userName: userData.displayName,
        // isCelebrity: true,
        syncToken,
        wtToken,
        roomId,
        constraints,
      };
      dispatch(setRoomSettings(payload));

      dispatch(setJoinModalType(null));
    } catch (error) {
      // setPasswordError('Wrong credentials');
    } finally {
      setLoadingState(false);
    }
  };

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
    // setUserData({ ...userData, [e.target.name]: e.target.value });
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
        <div className="uda-video-preview-wrapper" id="do-preview">
          <video id="video-preview" muted={true} />
        </div>
      </div>

      <div>
        <form className="uda-form">
          <div>
            <div className="uda-input-container" id="input-video-device">
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

            <div className="uda-input-container"  id="input-audio-device">
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

          {/*<div className="uda-input-container">*/}
          {/*  <input*/}
          {/*    className="uda-input"*/}
          {/*    name="email"*/}
          {/*    placeholder="Enter email"*/}
          {/*    value={userData.email}*/}
          {/*    onChange={handleChange}*/}
          {/*    id="email"*/}
          {/*    autoComplete="off"*/}
          {/*  />*/}
          {/*</div>*/}

          {/*<div className="uda-input-container">*/}
          {/*  <input*/}
          {/*    className="uda-input"*/}
          {/*    name="password"*/}
          {/*    placeholder="Enter password"*/}
          {/*    type="password"*/}
          {/*    value={userData.password}*/}
          {/*    onChange={handleChange}*/}
          {/*    onFocus={() => setPasswordError('')}*/}
          {/*    id="password"*/}
          {/*    autoComplete="off"*/}
          {/*  />*/}

          {/*  <div className="uda-input-error">{passwordError || ''}</div>*/}
          {/*</div>*/}

          <div>
            <button type="button" className="button uda-button" onClick={joinWithRole} tabIndex={0} disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              ) : (
                <span>Confirm</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserDataEntry;
