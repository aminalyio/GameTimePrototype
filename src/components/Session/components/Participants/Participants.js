import React from 'react';
import { useSelector } from 'react-redux';
import Video from 'components/Video/Video';
import './Participants.css';

function Participants() {
  const { participants } = useSelector((state) => state.session);

  let data = [...(participants || [])].filter((p) => !p.local);
  data = data.concat(Array(Math.max(3 - data.length, 0)).fill());

  return (
    <>
      {data.map((participant, index) => (
        <React.Fragment key={participant ? participant.participantId : index}>
          {participant ? (
            <Video participant={participant} />
          ) : (
            <div className="placeholder">
              <div className="icon" />
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
}

export default Participants;
