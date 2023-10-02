import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import './SessionError.css'

import { setSessionError } from 'store/reducers/SessionReducer'

function SessionError() {
  const dispatch = useDispatch()

  const sessionError = useSelector(state => state.session.sessionError)

  const handleSubmit = () => {
    dispatch(setSessionError(null))
  }

  if (!sessionError) {
    return null;
  }

  return (
    <div className='se-wrapper'>
      <div className='se-container'>
        {sessionError}

        <button
          className='button se-submit'
          onClick={handleSubmit}
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default SessionError
