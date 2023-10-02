import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import UserDataEntry from './components/UserDataEntry/UserDataEntry';
import './JoinModal.css';
import { setJoinModalType } from 'store/reducers/SessionReducer';

function JoinModal() {
  const dispatch = useDispatch();
  const joinModalType = useSelector((state) => state.session.joinModalType);

  if (joinModalType !== 'CELEBRITY_JOIN_DATA') {
    return null;
  }

  return (
    <div className="sd-wrapper">
      <div className="sd-container">
        <UserDataEntry />
      </div>
    </div>
  );
}

export default JoinModal;
