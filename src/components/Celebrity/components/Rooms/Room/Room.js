import React from 'react';
import classnames from 'classnames';

import Timer from './Timer/Timer';
import VisitedChips from './VisitedChips/VisitedChips';
import './Room.css';
import Countdown from 'components/Countdown/Countdown';

function Room({
  onClick,
  connected,
  id,
  duration,
  countdown,
  participants,
  disabled,
  loading,
  visited,
  picked,
  onFinish,
}) {
  return (
    <div className={classnames('room', visited && !connected && 'visited', connected && 'active')}>
      <div className="line">
        <div className="checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 14 9" fill="none">
            <path
              d="M12.5 1L5.16663 8L1.5 4.5"
              stroke="#A8FFB0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="name">USER {id}</div>
        <div className="time">
          <div className="icon" />
          <div>
            <Timer value={duration} />
          </div>
        </div>
      </div>
      <div className="line">
        {countdown != null && (
          <div>
            Time to connect: <Countdown value={countdown} />
          </div>
        )}
        {/*<div className="participants-count">*/}
        {/*  <div className="icon" />*/}
        {/*  <div>*/}
        {/*    <span className="count">{participants}</span>Participants*/}
        {/*  </div>*/}
        {/*</div>*/}
        {picked && (
          <button
            className={classnames('room-button', 'button', connected && 'outline')}
            onClick={onClick}
            disabled={disabled}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              <>{connected ? 'Disconnect' : picked ? 'Connect' : 'Select'}</>
            )}
          </button>
        )}

        {!connected && picked && (
          <button className={classnames('room-button', 'button')} onClick={onFinish}>
            Done
          </button>
        )}
      </div>
    </div>
  );
}

export default Room;
