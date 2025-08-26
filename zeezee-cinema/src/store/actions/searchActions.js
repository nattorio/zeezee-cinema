import TMDBApi from '../../services/movieService';
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

const tmdb = new TMDBApi(import.meta.env.VITE_TMDB_API_KEY);

// Action Creators
export const searchMovieRequest = () => ({
    type: SEARCH_MOVIES_REQUEST,
});

export const searchMoviesSuccess = (query, page, results, totalPages, totalResults) => ({
    type: SEARCH_MOVIES_SUCCESS,
    payload: { query, page, results, totalPages, totalResults },
});

export const searchMoviesFailure = (error) => ({
    type: SEARCH_MOVIES_FAILURE,
    payload: { error },
});

export const searchMultiRequest = () => ({
    type: SEARCH_MULTI_REQUEST,
});

export const searchMultiSuccess = (query, page, results, totalPages, totalResults) => ({
    type: SEARCH_MULTI_SUCCESS,
    payload: { query, page, results, totalPages, totalResults },
});

export const clearSearch = () => ({
    type: CLEAR_SEARCH,
});

export const setSearchType = (searchType) => ({
    type: SET_SEARCH_TYPE,
    payload: searchType,
});

export const addRecentSearch = () => ({
    type: ADD_RECENT_SEARCH,
    payload: search,
});

export const clearSearchCache = () => ({
    type: CLEAR_SEARCH_CACHE,
});

// Thunk Actions
export const searchMovies = ({ query, page = 1 }) => {
    return async (dispatch, getState) => {
        const state = getState();
        const cacheKey = `${query}_${page}`;

        // 캐시 확인
        if (state.search.cache[cacheKey]) {
            dispatch(
                searchMoviesSuccess(
                    query,
                    page,
                    state.search.cache[cacheKey],
                    state.search.totalPages,
                    state.search.totalResults
                )
            );
            return;
        }

        dispatch(searchMoviesRequest());

        try {
            const response = await tmdb.searchMovies(query, page);
            dispatch(searchMoviesSuccess(query, page, response.results, response.total_pages, response.total_results));
        } catch (error) {
            dispatch(searchMoviesFailure(error.message));
        }
    };
};

export const searchMulti = ({ query, page = 1 }) => {
    return async (dispatch) => {
        dispatch(searchMultiRequest());

        try {
            const response = await tmdb.searchMulti(query, page);
            dispatch(searchMultiSuccess(query, page, response.results, response.total_pages, response.total_results));
        } catch (error) {
            dispatch(searchMultiFailure(error.message));
        }
    };
};
