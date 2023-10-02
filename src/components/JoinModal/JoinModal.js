import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import UserDataEntry from './components/UserDataEntry/UserDataEntry';
import './JoinModal.css';
import { setJoinModalType } from 'store/reducers/SessionReducer';

function JoinModal() {
  const dispatch = useDispatch();
  const joinModalType = useSelector((state) => state.session.joinModalType);

  if (joinModalType !== 'USER_DATA_ENTRY') {
    return null;
  }

  function handleClose(e) {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');

    if (roomId) {
      return;
    }

    if (e.target === e.currentTarget) {
      dispatch(setJoinModalType(null));
    }
  }

  return (
    <div className="sd-wrapper" onClick={handleClose}>
      <div className="sd-container">
        <UserDataEntry />
      </div>
    </div>
  );
}

export default JoinModal;
