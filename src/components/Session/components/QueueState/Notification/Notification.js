import React, { useState } from 'react';
import 'components/Session/components/QueueState/Notification/Notification.css';

import WatchParty from 'components/WatchParty/WatchParty';
import classNames from 'classnames';

function Notification({ children, noJoin, open = false, importance = 'base' }) {
  // const [isOpen, setisOpen] = useState(open);
  //
  // const handleClose = () => {
  //   setisOpen(false);
  // };
  //
  // if (!isOpen) {
  //   return null;
  // }

  return (
    <div className="notification">
      <div
        className={classNames('notification-content', {
          'notification-warning': importance === 'warning',
          'notification-alert': importance === 'alert',
        })}
      >
        {children}

        {/*{!noJoin ? (*/}
        {/*  <div className="notification-join">*/}
        {/*    You can <WatchParty typeJoin /> to party.*/}
        {/*  </div>*/}
        {/*) : null}*/}
      </div>

      {/*<div className="notification-close" onClick={handleClose}>*/}
      {/*  <svg fill="#cbcbcb" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloseIcon">*/}
      {/*    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>*/}
      {/*  </svg>*/}
      {/*</div>*/}
    </div>
  );
}

export default Notification;
