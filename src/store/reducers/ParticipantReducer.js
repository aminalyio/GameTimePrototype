const SET_ROOM_SETTINGS = 'SET_ROOM_SETTINGS';
const SET_QUEUE_STATE = 'SET_QUEUE_STATE';
const RESET_STORE = 'RESET_STORE';
const SET_STREAM_SETTINGS = 'SET_STREAM_SETTINGS';

const initialState = {
  constraints: {
    audio: false,
    video: false,
  },
  syncToken: '',
  wtToken: '',
  roomId: '',
  queueState: null,
};

export function setQueueState(payload) {
  return {
    type: SET_QUEUE_STATE,
    payload,
  };
}

export function setRoomSettings(payload) {
  return {
    type: SET_ROOM_SETTINGS,
    payload,
  };
}

export function setStreamSettings(payload) {
  return {
    type: SET_STREAM_SETTINGS,
    payload,
  };
}

export function resetWTStore() {
  return {
    type: RESET_STORE,
    payload: {
      roomId: '',
      syncToken: '',
      wtToken: '',
      constraints: {
        audio: false,
        video: false,
      },
    },
  };
}

const ACTION_HANDLERS = {
  [SET_ROOM_SETTINGS]: (state, action) => {
    return {
      ...state,
      ...action.payload,
    };
  },
  [RESET_STORE]: (state, action) => {
    return { ...state, ...action.payload };
  },
  [SET_STREAM_SETTINGS]: (state, action) => {
    return { ...state, ...action.payload };
  },
  [SET_QUEUE_STATE]: (state, action) => {
    return { ...state, queueState: action.payload };
  },
};

export default function ParticipantReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
