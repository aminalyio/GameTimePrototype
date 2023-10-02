import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WT from '@sscale/wtsdk';
import { SDKError, QueueStatus } from '@sscale/celebritysdk';

// import { callable } from 'services/firebase';
import retry from 'async-retry';
import { setStreamSettings } from 'store/reducers/CelebrityReducer';
import { setSessionError, setConnectedClb } from 'store/reducers/SessionReducer';
import sessionStorage from 'utils/sessionStorage';
import Room from './Room/Room';
import './Rooms.css';
import { offVisibilityUpdate, onVisibilityUpdate } from 'utils/visibility';
import celebrityQueueAPI from 'services/celebrity';
import classnames from 'classnames';

function Rooms(props) {
  const { makeCelebrityLocal, isLoggedIn } = props;

  const dispatch = useDispatch();

  const { userName, constraints } = useSelector((state) => state.celebrity);
  const { sessionError } = useSelector((state) => state.session);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [pickedQueuer, setPickedQueuer] = useState(null);
  const [queuers, setQueuers] = useState([]);
  const [pageIsActive, setPageIsActive] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      return setPickedQueuer(null);
    }

    celebrityQueueAPI.currentQueuer().then((queuer) => {
      setPickedQueuer(queuer);
    });

    return () => {
      celebrityQueueAPI.unsubscribe();
    };
  }, [isLoggedIn, pageIsActive]);

  useEffect(() => {
    onVisibilityUpdate(setPageIsActive);
    return () => offVisibilityUpdate(setPageIsActive);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setQueuers([]);
    }

    if (!isLoggedIn || !pageIsActive) {
      return;
    }

    let timer;
    let aborted;
    const run = () => {
      celebrityQueueAPI
        .state()
        .then((state) => {
          if (aborted) {
            return;
          }

          setQueuers(state);
        })
        .catch((e) => {
          if (e.code === SDKError.CODE.NOT_AUTHORIZED) {
            throw e;
          } else {
            this.logger.warn(`Subscription error:`, e);
          }
        })
        .then(() => {
          if (aborted) {
            return;
          }

          timer = setTimeout(() => {
            run();
          }, 5000);
        })
        .catch((e) => console.log(e));
    };

    run();

    return () => {
      aborted = true;
      clearTimeout(timer);
    };
  }, [isLoggedIn, pageIsActive]);

  useEffect(() => {
    onVisibilityUpdate(setPageIsActive);
    return () => offVisibilityUpdate(setPageIsActive);
  }, []);

  const disconnect = () => {
    WT.Session.disconnect();
    dispatch(setConnectedClb(() => {}));
    dispatch(setStreamSettings({ syncToken: '', stream: '' }));
    setIsConnected(false);
    makeCelebrityLocal();
  };

  const goNext = async () => {
    try {
      WT.Session.disconnect();
      setPickedQueuer(null);
      setIsConnecting(true);
      setIsConnected(false);

      const picked = await celebrityQueueAPI.goNext();
      await celebrityQueueAPI.state().then(setQueuers).catch(console.error);

      if (!picked) {
        throw new Error('Next queuer is not available');
      }

      setPickedQueuer(picked);

      connect(picked);
    } catch (e) {
      console.error(e);
      dispatch(setSessionError('Unable to pick next queuer. Please try again.'));
      setIsConnecting(false);
      setIsConnected(false);
    }
  };

  const connect = async (picked) => {
    if (!picked) {
      return;
    }

    try {
      setIsConnecting(true);

      dispatch(
        setConnectedClb(() => {
          setIsConnecting(false);
          setIsConnected(true);

          dispatch(setConnectedClb(() => {}));
        }),
      );

      await WT.Session.connect(picked.session_token, userName, constraints, { isCelebrity: true });

      dispatch(setStreamSettings({ syncToken: picked.session_meta?.syncToken }));
    } catch (e) {
      console.error(e);
      dispatch(setSessionError('Unable to join the room. Please try again.'));
      setIsConnecting(false);
      setIsConnected(false);
      dispatch(setConnectedClb(() => {}));
    }
  };

  const done = (id) => {
    disconnect();
    celebrityQueueAPI
      .done(id)
      .then(() => {
        setPickedQueuer(null);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (sessionError) {
      WT.Session.disconnect();
      dispatch(setStreamSettings({ syncToken: '', stream: '' }));
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [sessionError]);

  const hasNext = queuers.find((queuer) => queuer.status === QueueStatus.CONNECTED);

  return (
    <div className="rooms">
      <div className="rooms-next">
        <button
          className={classnames('room-next-button', 'button')}
          onClick={goNext}
          disabled={isConnecting || isConnected || !hasNext}
        >
          {isConnecting ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            <>Go next</>
          )}
        </button>
      </div>
      <div className="rooms-connected">
        {pickedQueuer && (
          <Room
            duration={Date.now() - new Date(pickedQueuer.created_at).getTime()}
            id={pickedQueuer.user_id}
            connected={isConnected}
            picked
            disabled={isConnecting}
            loading={isConnecting}
            onClick={() => (isConnected ? disconnect() : connect(pickedQueuer))}
            onFinish={() => done(pickedQueuer.user_id)}
          />
        )}
      </div>

      <div className="rooms-content">
        {/*{nextQueuer && nextQueuer?.user_id !== pickedQueuer?.user_id && (*/}
        {/*  <Room*/}
        {/*    key={nextQueuer.user_id}*/}
        {/*    duration={Date.now() - new Date(nextQueuer.created_at).getTime()}*/}
        {/*    id={nextQueuer.user_id}*/}
        {/*    connected={false}*/}
        {/*    visited={false}*/}
        {/*    disabled={isConnecting}*/}
        {/*    onClick={() => goNext()}*/}
        {/*  />*/}
        {/*)}*/}
        <div className="room-status-block">CONNECTED</div>
        {queuers
          .filter((queuer) => queuer.status === QueueStatus.CONNECTED)
          .map((queuer) => (
            <Room
              key={queuer.user_id}
              duration={Date.now() - new Date(queuer.created_at).getTime()}
              id={queuer.user_id}
            />
          ))}

        <div className="room-status-block">WAITING FOR CONNECTION</div>
        {queuers
          .filter((queuer) => queuer.status === QueueStatus.CONNECTION_REQUIRED)
          .map((queuer) => (
            <Room
              key={queuer.user_id}
              duration={Date.now() - new Date(queuer.created_at).getTime()}
              id={queuer.user_id}
              countdown={queuer.action_required_countdown}
            />
          ))}

        <div className="room-status-block">WAITING</div>
        {queuers
          .filter((queuer) => queuer.status === QueueStatus.PENDING)
          .map((queuer) => (
            <Room
              key={queuer.user_id}
              duration={Date.now() - new Date(queuer.created_at).getTime()}
              id={queuer.user_id}
            />
          ))}
      </div>
    </div>
  );
}

export default Rooms;
