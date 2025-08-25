import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import movieCacheReducer from './reducers/moivereducer';
import searchReducer from './reducers/searchReducer';
import categoriesReducer from './reducers/categoriesReducer';
import paginationReducer from './reducers/paginationReducer';
import filtersReducer from './reducers/filterReducer';
import recommendationsReducer from './reducers/recommendationsReducer';
import movieDetailsReducer from './reducers/movieDetailsReducer';
import uiReducer from './reducers/uiReducer';

// Root Reducer 결합
const rootReducer = combineReducers({
    movieCache: movieCacheReducer,
    search: searchReducer,
    categories: categoriesReducer,
    pagination: paginationReducer,
    filters: filtersReducer,
    recommendations: recommendationsReducer,
    movieDetails: movieDetailsReducer,
    ui: uiReducer,
});

// Redux DevTools Extension 설정
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Store 생성
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
