import {createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension'
import {rootReducer} from './reducers';

export default function configureStore(preloadedState) {
    const composedEnhancers = composeWithDevTools();

    return createStore(rootReducer, preloadedState, composedEnhancers)
}
