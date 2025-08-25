import TMDBapi from '../../services/movieService';
import * as types from '../types/actionTypes';

const tmdb = new TMDBapi(import.meta.env.VITE_TMDB_API_KEY);

export const clearCurrentMovie = () => ({
    type: types.CLEAR_CURRENT_MOVIE,
});

export const fetchMovieFullDetails = (movieId) => {
    return async (dispatch) => {
        dispatch({ type: types.FETCH_MOVIE_FULL_DETAILS_REQUEST });

        try {
            const movieDetails = await tmdb.getMovieDetails(
                movieId,
                'ko-KR',
                'credits,videos,images,keywords,release_dates'
            );

            const reviews = await tmdb.getMovieReviews(movieId, 1);

            dispatch({
                type: types.FETCH_MOVIE_FULL_DETAILS_SUCCESS,
                payload: {
                    ...movieDetails,
                    reviews: reviews.results,
                    reviewsTotalPages: reviews.total_pages,
                },
            });
        } catch (error) {
            dispatch({
                type: types.FETCH_MOVIE_FULL_DETAILS_FAILURE,
                payload: { error: error.message },
            });
        }
    };
};

export const fetchMoreReviews = ({ movieId, page }) => {
    return async (dispatch) => {
        dispatch({ type: types.FETCH_MORE_REVIEWS_REQUEST });

        try {
            const response = await tmdb.getMovieReviews(movieId, page);
            dispatch({
                type: types.FETCH_MORE_REVIEWS_SUCCESS,
                payload: {
                    movieId,
                    reviews: response.results,
                    page: response.page,
                    totalPages: response.total_pages,
                },
            });
        } catch (error) {
            dispatch({
                type: types.FETCH_MORE_REVIEWS_FAILURE,
                payload: { error: error.message },
            });
        }
    };
};
