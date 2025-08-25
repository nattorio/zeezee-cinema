import {
    FETCH_MOVIE_FULL_DETAILS_REQUEST,
    FETCH_MOVIE_FULL_DETAILS_SUCCESS,
    FETCH_MOVIE_FULL_DETAILS_FAILURE,
    FETCH_MORE_REVIEWS_REQUEST,
    FETCH_MORE_REVIEWS_SUCCESS,
    FETCH_MORE_REVIEWS_FAILURE,
    CLEAR_CURRENT_MOVIE,
} from '../types/actionTypes';

const initialState = {
    current: null,
    reviews: {},
    loading: false,
    reviewsLoading: false,
    error: null,
};

const movieDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MOVIE_FULL_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_MORE_REVIEWS_SUCCESS:
            return {
                ...state,
                current: action.payload,
                reviews: {
                    ...state.reviews,
                    [action.payload.id]: {
                        items: action.payload.reviews,
                        page: 1,
                        totalPages: action.payload.reviewsTotalPages,
                    },
                },
                loading: false,
            };

        case FETCH_MOVIE_FULL_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case FETCH_MORE_REVIEWS_REQUEST:
            return {
                ...state,
                reviesLoading: true,
            };

        case FETCH_MORE_REVIEWS_SUCCESS:
            const { movieId, reviews, page, totalPages } = action.payload;
            const existingReviews = state.reviews[movieId]?.items || [];

            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    [movieId]: {
                        items: [...existingReviews, ...reviews],
                        page,
                        totalPages,
                    },
                },
                reviewsLoading: false,
            };

        case FETCH_MORE_REVIEWS_FAILURE:
            return {
                ...state,
                reviewsLoading: false,
            };

        case CLEAR_CURRENT_MOVIE:
            return {
                ...state,
                current: null,
            };
        default:
            return state;
    }
};

export default movieDetailsReducer;
