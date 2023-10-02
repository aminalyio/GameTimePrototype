import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setJoinModalType} from "store/reducers/SessionReducer";

import './WatchParty.css';

const WatchParty = ({ typeJoin }) => {
  const dispatch = useDispatch();

  async function handleClick() {
    dispatch(setJoinModalType('USER_DATA_ENTRY'));
  }

  if(typeJoin) {
    return (
      <a className="watch-party-type-join" onClick={handleClick} href='javascript:void(0);'>
        Join
      </a>
    );
  }

  return (
    <button className="button" onClick={handleClick} id="watch-party-btn">
      Watch party
    </button>
  );
};

export default WatchParty;
