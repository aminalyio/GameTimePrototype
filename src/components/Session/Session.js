import React, { useCallback } from 'react';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QueueStatus } from '@sscale/celebritysdk';
import WT from '@sscale/wtsdk';
import classnames from 'classnames';

import { publish } from 'services/PubSub';
import { onVisibilityUpdate, offVisibilityUpdate } from 'utils/visibility';
import { resetWTStore, setQueueState } from 'store/reducers/ParticipantReducer';
import {
  setSessionError,
  setParticipants,
  setJoinModalType,
  setConnectedClb,
  resetStore,
} from 'store/reducers/SessionReducer';
import { stopSync } from 'services/SyncService';

import Video from '../Video/Video';
import JoinModal from '../JoinModal/JoinModal';
import HtmlPlayer from '../Players/HtmlPlayer';
import SessionError from './components/SessionError/SessionError';
import Participants from './components/Participants/Participants';
import QueueState from './components/QueueState/QueueState';
import WatchParty from 'components/WatchParty/WatchParty';
import CopyLink from 'components/CopyLink/CopyLink';
import './Session.css';
import participantQueueAPI from 'services/participant';
import YoutubePlayer from 'components/Players/YoutubePlayer';

function Session() {
  const dispatch = useDispatch();

  const { roomId, syncToken, queueState, wtToken } = useSelector((state) => state.participant);
  const { participants, connectedClb } = useSelector((state) => state.session);

  const [roomHasCelebrity, setRoomCelebrityPresence] = useState(false);
  // const [roomsList, setRoomsList] = useState([]);
  // const [pageIsActive, setPageIsActive] = useState(true);

  const participantsRef = useRef(participants);
  const connectedClbRef = useRef(connectedClb);
  const makeCelebrityLocalRef = useRef();
  const roomHasCelebrityRef = useRef(roomHasCelebrity);
  const actualStateRef = useRef({ wtToken, syncToken });
  actualStateRef.current = { wtToken, syncToken };

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

  // useEffect(() => {
  //   if (isCelebrity !== null && userName) {
  //     makeCelebrityLocalRef.current();
  //   }
  // }, [userName, isCelebrity]);

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

      console.log('onConnected');
      let participants = [];

      WT.SessionListeners.onStreamCreated((params) => {
        const alreadyExists = participants.find((p) => p.participantId === params.participantId);

        console.log(params);
        if (alreadyExists) {
          const video = document.getElementById('participant-' + params.participantId);
          video.src = params.stream;
          // dispatch(setParticipants([...participants.filter(p => p.participantId !== params.participantId), { ...params }]))
        } else if (params.local) {
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

  // makeCelebrityLocalRef.current = useCallback(() => {
  //   dispatch(setParticipants([]));
  //   navigator.mediaDevices.getUserMedia(constraints).then((device) =>
  //     setRoomCelebrityPresence({
  //       stream: device,
  //       participantId: '1',
  //       participantName: userName,
  //       streamConstraints: constraints,
  //       local: true,
  //       preview: true,
  //     }),
  //   );
  // }, []);

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');

    if (roomId) {
      dispatch(setJoinModalType('USER_DATA_ENTRY'));
    }
  }, []);

  function disconnect() {
    WT.Session.disconnect();
    stopSync();
    // stopLocalStream();

    window.history.replaceState({}, '', '/');

    setRoomCelebrityPresence(null);
    // setRoomsList([]);
    dispatch(setParticipants([]));
    dispatch(resetWTStore());

    // dispatch(setJoinModalType('USER_DATA_ENTRY'));
  }

  function joinCelebrityQueue() {
    return participantQueueAPI.joinQueue().then((state) => {
      if (actualStateRef.current.wtToken && state.status === QueueStatus.CONNECTION_REQUIRED) {
        participantQueueAPI
          .confirmSession(actualStateRef.current.wtToken, { syncToken: actualStateRef.current.syncToken })
          .then((state) => dispatch(setQueueState(state)));
      } else {
        dispatch(setQueueState(state));
      }
    });
  }

  function leaveCelebrityQueue() {
    return participantQueueAPI.leaveQueue().then((state) => {
      dispatch(setQueueState(state));
    });
  }

  return (
    <div className="session-container">
      <div className="s-header-container">
        <div className="s-logo">
          <div className="s-logo__sceenic">
            Powered by
            <div className="s-logo__sceenic-logo" />
          </div>
        </div>
      </div>

      <div className="s-body">
        <div className="s-activity-container">
          <div className="s-participants">
            <div className="s-celebrity-container" id="local-participant-video">
              <div className="s-celebrity-video">
                <Video participant={roomHasCelebrity} />
              </div>

              <div className="s-snapshot">
                <button
                  className={classnames(
                    's-invite-btn',
                    queueState && queueState.status !== QueueStatus.FAILED && 's-invite-btn__done',
                  )}
                  onClick={(e) => {
                    if (queueState && queueState.status !== QueueStatus.FAILED) {
                      leaveCelebrityQueue();
                    } else {
                      joinCelebrityQueue();
                    }
                    /*.then(() => {
                      const cls = e.target.getAttribute('class');
                      e.target.setAttribute('class', [cls, 's-invite-btn__done'].join(' '));
                    });*/
                  }}
                  title="Invite"
                />

                {roomId ? (
                  <>
                    <CopyLink />
                    <button className="s-disconnect-btn" onClick={disconnect} title="Disconnect" />
                  </>
                ) : (
                  <WatchParty />
                )}
              </div>
            </div>

            <Participants />
          </div>

          <div className="s-player-container">
            <YoutubePlayer isLoggedIn />
            <div className="s-player-notification">
              <QueueState />
            </div>
          </div>
        </div>

        {/*<Rooms key={userName} isLoggedIn={isCelebrity} makeCelebrityLocal={makeCelebrityLocalRef.current} />*/}

        <JoinModal />

        <SessionError />
      </div>
    </div>
  );
}

export default Session;
