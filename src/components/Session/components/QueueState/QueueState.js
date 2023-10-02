import { useEffect, useRef, useState } from 'react';
import { QueueStatus } from '@sscale/celebritysdk';
import participantQueueAPI from 'services/participant';
import { useDispatch, useSelector } from 'react-redux';
import { offVisibilityUpdate, onVisibilityUpdate } from 'utils/visibility';
import { setQueueState } from 'store/reducers/ParticipantReducer';

import Notification from './Notification/Notification';
import Countdown from '../../../Countdown/Countdown';

function QueueState() {
  const dispatch = useDispatch();
  const { queueState, wtToken, syncToken } = useSelector((state) => state.participant);
  const [pageIsActive, setPageIsActive] = useState(true);
  const inTheQueue = Boolean(queueState) && queueState.status !== QueueStatus.FAILED;
  const stateRef = useRef({ queueState, wtToken, syncToken });
  stateRef.current = { queueState, wtToken, syncToken };

  useEffect(() => {
    participantQueueAPI.getState().then((state) => {
      if (state?.status !== QueueStatus.FAILED) {
        dispatch(setQueueState(state));
      }
    });
    //
    // dispatch(
    //   setConnectedClb(() => {
    //     console.log('onconnect', stateRef.current);
    //     if (
    //       [QueueStatus.CONNECTION_REQUIRED, QueueStatus.CONNECTED].includes(stateRef.current.queueState?.status) &&
    //       stateRef.current.wtToken
    //     ) {
    //       participantQueueAPI
    //         .confirmSession(stateRef.current.wtToken, { syncToken: stateRef.current.syncToken })
    //         .then((state) => dispatch(setQueueState(state)));
    //     }
    //   }),
    // );
  }, []);

  useEffect(() => {
    if (
      [QueueStatus.CONNECTION_REQUIRED, QueueStatus.CONNECTED].includes(stateRef.current.queueState?.status) &&
      wtToken
    ) {
      participantQueueAPI
        .confirmSession(wtToken, { syncToken: stateRef.current.syncToken })
        .then((state) => dispatch(setQueueState(state)));
    }
  }, [wtToken]);

  useEffect(() => {
    if (!pageIsActive || !inTheQueue) {
      return;
    }

    participantQueueAPI.subscribe((state) => {
      dispatch(setQueueState(state));
    });

    return () => {
      participantQueueAPI.unsubscribe();
    };
  }, [pageIsActive, inTheQueue]);

  useEffect(() => {
    onVisibilityUpdate(setPageIsActive);
    return () => offVisibilityUpdate(setPageIsActive);
  }, []);

  if (!queueState) {
    return null;
  }

  const state = {
    [queueState.status === QueueStatus.PENDING]: {
      text: `Your position in the queue is #${queueState.position}. When there will be only a couple of people in front of you, you will be required to create a WT session and maintain it until the celebrity will pick you.`,
      importance: 'base',
    },
    [queueState.status === QueueStatus.CONNECTION_REQUIRED]: {
      text: (
        <>
          {`Your position in the queue is #${queueState.position}.`} You have{' '}
          <Countdown value={queueState.action_required_countdown} /> to create a WT session, otherwise you will have to
          join the queue again.{' '}
        </>
      ),
      importance: 'alert',
    },
    [queueState.status === QueueStatus.CONNECTED]: {
      text: (
        <>
          {`Your position in the queue is #${queueState.position}.`} WT session is online, keep it until the celebrity
          picks you.
        </>
      ),
      importance: 'base',
    },
    [queueState.status === QueueStatus.FAILED]: {
      text: `Please, join the queue again`,
      importance: 'warning',
    },
  }.true;

  if (!state) {
    return null;
  }

  return <Notification importance={state.importance}>{state.text}</Notification>;
}

export default QueueState;
