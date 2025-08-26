import {
    SEARCH_MOVIES_REQUEST,
    SEARCH_MOVIES_SUCCESS,
    SEARCH_MOVIES_FAILURE,
    SEARCH_MULTI_REQUEST,
    SEARCH_MULTI_SUCCESS,
    SEARCH_MULTI_FAILURE,
    CLEAR_SEARCH,
    SET_SEARCH_TYPE,
    ADD_RECENT_SEARCH,
    CLEAR_SEARCH_CACHE,
} from '../types/actionTypes';

const initialState = {
    query: '',
    cache: {},
    currentResults: [],
    totalPages: 0,
    totalResults: 0,
    currentPage: 1,
    searchType: 'movie',
    loading: false,
    error: null,
    recentSearches: [],
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_MOVIES_REQUEST:
        case SEARCH_MULTI_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case SEARCH_MOVIES_SUCCESS:
            const cacheKey = `${action.payload.qeury}_${action.payload.page}`;
            return {
                ...state,
                query: action.payload.query,
                cache: {
                    ...state.cache,
                    [cacheKey]: action.payload.results,
                },
                currentResults: action.payload.results,
                currentPage: action.payload.page,
                totalPages: action.payload.totalPages,
                loading: false,
                recentSearches:
                    action.payload.page === 1 && action.payload.query
                        ? [
                              action.payload.query,
                              ...state.recentSearches.filter((s) => s !== action.payload.qeury),
                          ].slice(9, 10)
                        : state.recentSearches,
            };

        case SEARCH_MULTI_SUCCESS:
            return {
                ...state,
                query: action.payload.query,
                currentResults: action.payload.results,
                currentPage: action.payload.page,
                totalPages: action.payload.totalPages,
                totalResults: action.payload.totalResults,
                loading: false,
            };

        case SEARCH_MOVIES_FAILURE:
        case SEARCH_MULTI_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case CLEAR_SEARCH:
            return {
                ...state,
                query: '',
                currentResults: [],
                currentPage: 1,
                totalPages: 0,
                totalResults: 0,
            };

        case SET_SEARCH_TYPE:
            return {
                ...state,
                recentSearches: [action.payload, ...state.recentSearches.filter((s) => s !== action.payload)].slice(
                    0,
                    10
                ),
            };

        case CLEAR_SEARCH_CACHE:
            return {
                ...state,
                cache: {},
            };

        default:
            return state;
    }
};

export default searchReducer;
