import TMDBApi from '../../services/movieService';
import {
    FETCH_MOVIE_DETAIL_REQUEST,
    FETCH_MOVIE_DETAIL_SUCCESS,
    FETCH_MOVIE_DETAIL_FAILURE,
    CLEAR_MOVIE_CACHE,
    REMOVE_FROM_CACHE,
} from '../types/actionTypes';

const tmdb = new TMDBApi(import.meta.env.VITE_TMDB_API_KEY);
const CACHE_DURATION = 3600000; // 1시간

// Action Creators
export const fetchMovieDetailRequest = (movieId) => ({
    type: FETCH_MOVIE_DETAIL_REQUEST,
    payload: { movieId },
});

export const fetchMovieDetailSuccess = (movieId, data) => ({
    type: FETCH_MOVIE_DETAIL_SUCCESS,
    payload: { movieId, data },
});

export const fetchMovieDetailFailure = (movieId, error) => ({
    type: FETCH_MOVIE_DETAIL_FAILURE,
    payload: { movieId, error },
});

export const clearMovieCache = () => ({
    type: CLEAR_MOVIE_CACHE,
});

export const removeFromCache = (movieId) => ({
    type: REMOVE_FROM_CACHE,
    payload: movieId,
});

// Thunk Actions
export const fetchMovieDetail = ({ movieId, forceRefresh = false }) => {
    return async (dispatchEvent, getState) => {
        const state = getState();
        const cached = state.movieCache.details[movieId];
        const lastFetched = state.movieCache.lastFetched[movieId];

        // 캐시 확인
        if (!forceRefresh && cached && Date.now() - lastFetched < CACHE_DURATION) {
            return cached;
        }

        dispatch(fetchMovieDetailRequest(movieId));

        try {
            const data = await tmdb.getMovieDetails(movieId, 'ko-KR', 'credits,videos,images');
            dispatch(fetchMovieDetailSuccess(movieId, data));
            return data;
        } catch (error) {
            dispatch(fetchMovieDetailFailure(movieId, error.message));
            throw error;
        }
    };
};
