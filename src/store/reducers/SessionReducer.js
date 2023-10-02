const RESET_SESSION_STORE = 'RESET_SESSION_STORE';
const SET_SESSION_ERROR = 'SET_SESSION_ERROR';
const SET_JOIN_MODAL_TYPE = 'SET_JOIN_MODAL_TYPE';
const SET_PARTICIPANTS = 'SET_PARTICIPANTS';
const SET_CONNECTED_CLB = 'SET_CONNECTED_CLB';
const SET_CONNECTED = 'SET_CONNECTED';

const initialState = {
  sessionError: null,
  joinModalType: null,
  participants: [],
  connectedClb: () => {},
};

export function resetStore() {
  return {
    type: RESET_SESSION_STORE,
    payload: initialState,
  };
}

export function setSessionError(payload) {
  return {
    type: SET_SESSION_ERROR,
    payload,
  };
}

export function setJoinModalType(payload) {
  return {
    type: SET_JOIN_MODAL_TYPE,
    payload,
  };
}

export function setParticipants(payload) {
  return {
    type: SET_PARTICIPANTS,
    payload,
  };
}

export function setConnectedClb(payload) {
  return {
    type: SET_CONNECTED_CLB,
    payload,
  };
}

const ACTION_HANDLERS = {
  [RESET_SESSION_STORE]: (state, action) => {
    return action.payload;
  },
  [SET_SESSION_ERROR]: (state, action) => {
    return { ...state, sessionError: action.payload };
  },
  [SET_JOIN_MODAL_TYPE]: (state, action) => {
    return { ...state, joinModalType: action.payload };
  },
  [SET_PARTICIPANTS]: (state, action) => {
    return { ...state, participants: action.payload };
  },
  [SET_CONNECTED_CLB]: (state, action) => {
    return { ...state, connectedClb: action.payload };
  },
};

export default function SessionReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
