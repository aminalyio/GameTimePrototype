import React, { useCallback } from 'react';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WT from '@sscale/wtsdk';

import { publish } from 'services/PubSub';
import { onVisibilityUpdate, offVisibilityUpdate } from 'utils/visibility';
import { resetStore as resetCelebrityStore } from 'store/reducers/CelebrityReducer';
import { setSessionError, setParticipants, setJoinModalType } from 'store/reducers/SessionReducer';
import celebrityAPI from 'services/celebrity';

import Video from '../Video/Video';
import JoinModal from './components/JoinModal/JoinModal';
import Rooms from './components/Rooms/Rooms';
import Player from '../Player/Player';
import SessionError from './components/SessionError/SessionError';
import Participants from './components/Participants/Participants';
import './Celebrity.css';
import CopyLink from 'components/CopyLink/CopyLink';
import WatchParty from 'components/WatchParty/WatchParty';

function Session() {
  const dispatch = useDispatch();

  const { isCelebrity, userName, constraints } = useSelector((state) => state.celebrity);
  const { participants, connectedClb } = useSelector((state) => state.session);

  const [roomHasCelebrity, setRoomCelebrityPresence] = useState(false);
  // const [roomsList, setRoomsList] = useState([]);
  // const [pageIsActive, setPageIsActive] = useState(true);

  const participantsRef = useRef(participants);
  const connectedClbRef = useRef(connectedClb);
  const makeCelebrityLocalRef = useRef();
  const roomHasCelebrityRef = useRef(roomHasCelebrity);

  // useEffect(() => {
  //   if (!isCelebrity || !pageIsActive) {
  //     return;
  //   }
  //
  //   const ref = { timerId: 0 };
  //   syncRoomList(ref);
  //
  //   return () => {
  //     clearTimeout(ref.timerId);
  //   };
  // }, [isCelebrity, pageIsActive]);
  //
  // useEffect(() => {
  //   onVisibilityUpdate(setPageIsActive);
  //
  //   return () => offVisibilityUpdate(setPageIsActive);
  // }, []);

  useEffect(() => {
    if (isCelebrity !== null) {
      if (roomHasCelebrity) {
        return;
      }

      makeCelebrityLocalRef.current();
    }
  }, [isCelebrity]);

  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  useEffect(() => {
    roomHasCelebrityRef.current = roomHasCelebrity;
  }, [roomHasCelebrity]);

  useEffect(() => {
    connectedClbRef.current = connectedClb;
  }, [connectedClb]);

  useEffect(() => {
    WT.ErrorsListeners.onSessionError((error) => {
      dispatch(setSessionError('Unexpected error. Unable to join the room.'));
      makeCelebrityLocalRef.current();
    });

    WT.SessionListeners.onConnected(() => {
      connectedClbRef.current();

      let participants = [];

      WT.SessionListeners.onStreamCreated((params) => {
        const alreadyExists = participants.find((p) => p.participantId === params.participantId);

        if (alreadyExists) {
          const video = document.getElementById('participant-' + params.participantId);
          video.src = params.stream;
          // dispatch(setParticipants([...participants.filter(p => p.participantId !== params.participantId), { ...params }]))
        } else if (params.isCelebrity) {
          setRoomCelebrityPresence(params);
        } else {
          participants.push(params);
          dispatch(setParticipants([...participants]));
        }
      });

      WT.ParticipantListeners.onParticipantLeft(({ participantId }) => {
        if (roomHasCelebrityRef?.current && roomHasCelebrityRef?.current?.participantId === participantId) {
          setRoomCelebrityPresence(null);
        } else {
          participants = [...participants.filter((p) => p.participantId !== participantId)];
          dispatch(setParticipants(participants.filter((p) => p.participantId !== participantId)));
        }
      });
    });

    WT.ParticipantListeners.onParticipantMediaStreamChanged(publish.bind(null, 'onParticipantMediaStreamChanged'));
    WT.ParticipantListeners.onParticipantSpeaking(publish.bind(null, 'onParticipantSpeaking'));
    WT.ParticipantListeners.onParticipantStopSpeaking(publish.bind(null, 'onParticipantStopSpeaking'));
  }, []);

  makeCelebrityLocalRef.current = useCallback(() => {
    dispatch(setParticipants([]));
    navigator.mediaDevices.getUserMedia(constraints).then((device) =>
      setRoomCelebrityPresence({
        stream: device,
        participantId: '1',
        participantName: userName,
        streamConstraints: constraints,
        local: true,
        preview: true,
      }),
    );
  }, [userName, constraints]);

  const stopLocalStream = () => {
    const tracks = roomHasCelebrityRef?.current?.stream?.getTracks();

    if (tracks && tracks.length > 0) {
      tracks[0].stop();
    }
  };

  useEffect(() => {
    return () => {
      stopLocalStream();
    };
  }, []);

  useEffect(() => {
    dispatch(setJoinModalType('CELEBRITY_JOIN_DATA'));
  }, []);

  // const syncRoomList = (ref) => {
  //   const getSessions = callable('getSessions');
  //
  //   const fetchSessions = async () => {
  //     try {
  //       try {
  //         const res = await getSessions();
  //         setRoomsList(res?.data || []);
  //       } catch (e) {
  //         // ignore
  //       }
  //
  //       ref.timerId = setTimeout(fetchSessions, 5000);
  //     } catch (e) {}
  //   };
  //
  //   fetchSessions();
  // };

  function logout() {
    WT.Session.disconnect();

    stopLocalStream();

    celebrityAPI.logout();

    setRoomCelebrityPresence(null);
    // setRoomsList([]);
    dispatch(setParticipants([]));
    dispatch(resetCelebrityStore());

    dispatch(setJoinModalType('CELEBRITY_JOIN_DATA'));
  }

  return (
    <div className="session-container is-celebrity-page">
      <div className="s-header-container">
        <div className="s-logo">
          <div className="s-logo__sceenic">
            Powered by
            <div className="s-logo__sceenic-logo" />
          </div>
        </div>
      </div>

      <div className="s-body">
        <div className="s-celebrity-container">
          <div className="s-celebrity-video">
            <Video participant={roomHasCelebrity} isControlled={Boolean(participants.length)} isCelebrity={true} />
          </div>
          <button className="s-logout" onClick={logout} title={'Log out'} />
        </div>

        <div className="s-activity-container">
          <div className="s-participants">
            <Participants />
          </div>

          <div className="s-player-container">
            <Player isLoggedIn={isCelebrity} />
          </div>
        </div>

        <Rooms key={userName} isLoggedIn={isCelebrity} makeCelebrityLocal={makeCelebrityLocalRef.current} />

        <JoinModal />

        <SessionError />
      </div>
    </div>
  );
}

export default Session;
