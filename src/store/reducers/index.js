import { combineReducers } from 'redux';
import ParticipantReducer from './ParticipantReducer';
import CelebrityReducer from './CelebrityReducer';
import SessionReducer from './SessionReducer';

export const rootReducer = combineReducers({
  participant: ParticipantReducer,
  celebrity: CelebrityReducer,
  session: SessionReducer,
});
