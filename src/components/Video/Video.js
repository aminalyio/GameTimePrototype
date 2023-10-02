import React, { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import WT from '@sscale/wtsdk';
import { on, off } from 'services/PubSub';
import './Video.css';

function Video({ participant, isControlled=false, isCelebrity=false }) {
  const [videoState, setVideoState] = useState('');
  const [audioState, setAudioState] = useState('');

  useEffect(() => {
    setVideoState(participant?.settings?.mutedVideo || !participant?.streamConstraints?.video ? 'DISABLED' : '');
    setAudioState(participant?.settings?.mutedAudio || !participant?.streamConstraints?.audio ? 'DISABLED' : '');

    function onParticipantMediaStreamChanged({ participantId, mediaType, mediaState }) {
      if (participantId === participant?.participantId) {
        switch (mediaType) {
          case 'VIDEO':
            return setVideoState(mediaState);
          case 'AUDIO':
            return setAudioState(mediaState);
          default:
            return setAudioState('DISABLED');
        }
      }
    }

    function onParticipantSpeaking(participantId) {
      if (participantId === participant?.participantId) {
        const elem = document.getElementById(`video-container-${participant?.participantId}`);

        if (elem) {
          elem.classList.add('active-speaker');
        }
      }
    }

    function onParticipantStopSpeaking(participantId) {
      if (participantId === participant?.participantId) {
        const elem = document.getElementById(`video-container-${participant?.participantId}`);

        if (elem) {
          elem.classList.remove('active-speaker');
        }
      }
    }

    on('onParticipantMediaStreamChanged', onParticipantMediaStreamChanged);
    on('onParticipantSpeaking', onParticipantSpeaking);
    on('onParticipantStopSpeaking', onParticipantStopSpeaking);

    return () => {
      off('onParticipantMediaStreamChanged', onParticipantMediaStreamChanged);
      off('onParticipantSpeaking', onParticipantSpeaking);
      off('onParticipantStopSpeaking', onParticipantStopSpeaking);
    };
  }, [participant]);

  const memoizedVideo = useMemo(() => {
    if (!participant) {
      return null;
    }

    return (
      <video
        className="video"
        muted={!!participant?.local}
        id={'participant-' + participant?.participantId}
        playsInline
        autoPlay
        disablePictureInPicture
        ref={(r) => {
          if (r) {
            r.srcObject = participant?.stream;
          }
        }}
      />
    );
  }, [participant?.participantId, participant?.local, participant?.stream]);

  function toggleCamera() {
    if (!participant?.preview && participant?.local && participant?.streamConstraints.video) {
      if (videoState !== 'DISABLED') {
        WT.Participant.disableVideo();
      } else {
        WT.Participant.enableVideo();
      }
    }
  }

  function toggleMic() {
    if (!participant?.preview && participant?.local && participant?.streamConstraints.audio) {
      if (audioState !== 'DISABLED') {
        WT.Participant.disableAudio();
      } else {
        WT.Participant.enableAudio();
      }
    }
  }

  return (
    <div
      id={`video-container-${participant?.participantId}`}
      className={classnames('video-container', participant?.local && 'local', participant?.preview && 'preview')}
      key={participant?.participantId}
    >
      <div className="video-wrapper">{memoizedVideo}</div>

      {(videoState === 'DISABLED' || !participant?.stream) && (
        <div className="video-placeholder">
          <div className="icon" />
        </div>
      )}

      <div className="control-video-block" style={{visibility: isCelebrity && !isControlled ? 'hidden' : 'visible'}}>
        <div className="participant-camera" onClick={toggleCamera}>
          {videoState !== 'DISABLED' ? (
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.375 8.4375H21.375C22.5685 8.4375 23.7131 8.91161 24.557 9.75552C25.4009 10.5994 25.875 11.744 25.875 12.9375V26.4375C25.875 26.7359 25.7565 27.022 25.5455 27.233C25.3345 27.444 25.0484 27.5625 24.75 27.5625H6.75C5.55653 27.5625 4.41193 27.0884 3.56802 26.2445C2.72411 25.4006 2.25 24.256 2.25 23.0625V9.5625C2.25 9.26413 2.36853 8.97798 2.5795 8.76701C2.79048 8.55603 3.07663 8.4375 3.375 8.4375V8.4375Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M25.875 15.75L33.75 11.25V24.75L25.875 20.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M30 22L23 18V14L30 10V22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.36363 3L28 29"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.8603 7.5H19C20.0609 7.5 21.0783 7.92143 21.8284 8.67157C22.5786 9.42172 23 10.4391 23 11.5V18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23 23.5C23 23.7652 22.8946 24.0196 22.7071 24.2071C22.5196 24.3946 22.2652 24.5 22 24.5H6C4.93913 24.5 3.92172 24.0786 3.17157 23.3284C2.42143 22.5783 2 21.5609 2 20.5V8.5C2 8.23478 2.10536 7.98043 2.29289 7.79289C2.48043 7.60536 2.73478 7.5 3 7.5H8.45455"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <div className="participant-mic" onClick={toggleMic}>
          {audioState !== 'DISABLED' ? (
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 3H16C17.3261 3 18.5979 3.52678 19.5355 4.46447C20.4732 5.40215 21 6.67392 21 8V16C21 17.3261 20.4732 18.5979 19.5355 19.5355C18.5979 20.4732 17.3261 21 16 21H16C15.3434 21 14.6932 20.8707 14.0866 20.6194C13.4799 20.3681 12.9288 19.9998 12.4645 19.5355C12.0002 19.0712 11.6319 18.5201 11.3806 17.9134C11.1293 17.3068 11 16.6566 11 16V7.99999C11 6.67391 11.5268 5.40214 12.4645 4.46446C13.4021 3.52678 14.6739 3 16 3V3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 25V29"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24.9451 17C24.6989 19.2002 23.6505 21.2324 22.0003 22.7082C20.3501 24.1841 18.2139 25 16 25C13.7861 25 11.6499 24.1841 9.9997 22.7082C8.34951 21.2324 7.30112 19.2001 7.05493 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 28.125V32.625"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.75 5.625L29.25 30.375"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.7838 22.1622C20.7495 23.1052 19.3997 23.627 18 23.625H18C16.5082 23.625 15.0774 23.0324 14.0225 21.9775C12.9676 20.9226 12.375 19.4918 12.375 18V11.8125"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24.8108 25.4919C23.4302 26.7469 21.7298 27.5961 19.8971 27.9457C18.0644 28.2952 16.1707 28.1317 14.4251 27.473C12.6795 26.8144 11.1498 25.6862 10.0048 24.2131C8.85989 22.74 8.1442 20.9792 7.93677 19.125"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M28.0631 19.125C27.9437 20.2089 27.6488 21.2662 27.1899 22.2554"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.2129 6.04467C13.7167 5.22816 14.421 4.55417 15.259 4.08687C16.0969 3.61957 17.0405 3.3745 17.9999 3.375H17.9999C18.7386 3.375 19.47 3.5205 20.1525 3.80318C20.835 4.08586 21.455 4.50019 21.9774 5.02252C22.4997 5.54485 22.914 6.16494 23.1967 6.8474C23.4794 7.52985 23.6249 8.2613 23.6249 8.99999V17.4978"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/*{participant?.local && <div className="participant-name">{participant?.participantName}</div>}*/}
      </div>
    </div>
  );
}

export default Video;
