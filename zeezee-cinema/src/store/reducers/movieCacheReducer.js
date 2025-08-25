import {
    FETCH_MOVIE_DETAIL_REQUEST,
    FETCH_MOVIE_DETAIL_SUCCESS,
    FETCH_MOVIE_DETAIL_FAILURE,
    CLEAR_MOVIE_CACHE,
    REMOVE_FROM_CACHE,
} from '../types/actionTypes';

const initialState = {
    details: {},
    lastFetched: {},
    loading: {},
    error: null,
};

const movieCacheReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MOVIE_DETAIL_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.payload.movieId]: true,
                },
                error: null,
            };

        case FETCH_MOVIE_DETAIL_SUCCESS:
            return {
                ...state,
                details: {
                    ...state.details,
                    [action.payload.movieId]: Date.now(),
                },
                loading: {
                    ...state.loading,
                    [action.payload.movieId]: false,
                },
            };

        case FETCH_MOVIE_DETAIL_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.payload.movieId]: false,
                },
                error: action.payload.error,
            };

        case CLEAR_MOVIE_CACHE:
            return {
                ...state,
                details: {},
                lastFetched: {},
            };

        case REMOVE_FROM_CACHE:
            const { [action.payload]: removeDetail, ...remainingDetails } = state.details;
            const { [action.payload]: removeFetch, ...remainingFetched } = state.lastFetched;
            return {
                ...state,
                details: remainingDetails,
                lastFetched: remainingFetched,
            };

        default:
            return state;
    }
};

export default movieCacheReducer;
