const SET_ROOM_SETTINGS = 'SET_ROOM_SETTINGS';
const RESET_STORE = 'RESET_STORE';
const SET_STREAM_SETTINGS = 'SET_STREAM_SETTINGS';

const initialState = {
  userName: '',
  isCelebrity: null,
  stream: null,
  syncToken: '',
  constraints: {
    audio: false,
    video: false,
  },
};

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

export function resetStore() {
  return {
    type: RESET_STORE,
    payload: {
      userName: '',
      isCelebrity: null,
      stream: null,
      syncToken: '',
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
};

export default function CelebrityReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
