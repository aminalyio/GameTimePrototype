const SET_ROOM_SETTINGS = 'SET_ROOM_SETTINGS';
const SET_QUEUE_STATE = 'SET_QUEUE_STATE';
const SET_PLAYER_ID = 'SET_PLAYER_ID';
const SET_VIDEO_ID = 'SET_VIDEO_ID';
const RESET_STORE = 'RESET_STORE';
const SET_STREAM_SETTINGS = 'SET_STREAM_SETTINGS';
const SET_CONSTRAINTS = 'SET_CONSTRAINTS';
const SET_JOINED_PARTY = 'SET_JOINED_PARTY';

const initialState = {
  constraints: {
    audio: false,
    video: false,
  },
  syncToken: '',
  wtToken: '',
  roomId: '',
  playerId:'',
  videoId:'',
  joinedParty: false,
  queueState: null,
};

export function setJoinedParty(payload) {
  return {
    type: SET_JOINED_PARTY,
    payload,
  }
}

export function setConstraints(payload) {
  return {
    type: SET_CONSTRAINTS,
    payload,
  };
}

export function setQueueState(payload) {
  return {
    type: SET_QUEUE_STATE,
    payload,
  };
}

export function setPlayerId(payload) {
  return {
    type: SET_PLAYER_ID,
    payload,
  };
}

export function setVideoId(payload) {
  return {
    type: SET_VIDEO_ID,
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
  [SET_PLAYER_ID]: (state, action) => {
    return { ...state, playerId: action.payload };
  },
  [SET_VIDEO_ID]: (state, action) => {
    return { ...state, videoId: action.payload };
  },
  [SET_CONSTRAINTS]: (state, action) => {
    return { ...state, constraints: action.payload};
  },
  [SET_JOINED_PARTY]: (state, action) => {
    return { ...state, joinedParty: action.payload};
  },
};

export default function ParticipantReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
