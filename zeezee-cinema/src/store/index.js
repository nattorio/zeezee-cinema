import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { getMovieIdReducer } from './reducers/movieDetailsReducer';

// Root Reducer 결합
const rootReducer = combineReducers({
    getMovieId: getMovieIdReducer,
});

// Redux DevTools Extension 설정
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Store 생성
const store = createStore(rootReducer);

export default store;
