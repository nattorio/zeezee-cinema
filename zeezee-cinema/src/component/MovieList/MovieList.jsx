import MovieCard from '../MovieCard/MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useState, useEffect, useCallback } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import createMovies from '../../services/movieService';

function MovieList({ listTitle }) {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    const fetchMovies = useCallback(async () => {
        try {
            setError(null);

            const moviesApi = new createMovies(import.meta.env.VITE_TMDB_API_KEY);
            let response;

            if (listTitle === 'Now Playing') {
                response = await moviesApi.getNowPlayingMovies();
            } else if (listTitle === 'Upcoming Releases') {
                response = await moviesApi.getUpcomingMovies();
            } else if (listTitle === 'Popular Movies') {
                response = await moviesApi.getTopRatedMovies();
            } else if (listTitle === 'Top Rated') {
                response = await moviesApi.getPopularMovies();
            }

            const movieData = response.results || response || [];

            if (!Array.isArray(movieData)) {
                throw new Error('유효하지 않은 API 응답입니다');
            }

            const movieSlides = movieData
                .filter((movie) => movie.backdrop_path)
                .map((movie) => ({
                    id: movie.id,
                    img: `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`,
                    alt: movie.title || '영화 포스터',
                    title: movie.title || '제목 없음',
                    overview: movie.overview || '줄거리가 없습니다.',
                    releaseDate: movie.release_date || '',
                    voteAverage: movie.vote_average || 0,
                }));

            if (movieSlides.length === 0) {
                throw new Error('표시할 영화가 없습니다');
            }

            setMovies(movieSlides);
        } catch (err) {
            console.error('영화 데이터를 가져오는데 실패했습니다:', err);
            setError(err.message || '영화 데이터를 로드할 수 없습니다.');
        }
    }, [listTitle]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleRetry = useCallback(() => {
        fetchMovies();
    }, [fetchMovies]);

    // 에러 상태
    if (error) {
        return (
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{listTitle}</h2>
                <div className="flex items-center justify-center h-32 bg-red-50 rounded-lg">
                    <div className="text-center">
                        <div className="text-red-600 mb-2">{error}</div>
                        <button
                            onClick={handleRetry}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 영화가 없는 경우
    if (movies.length === 0) {
        return (
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{listTitle}</h2>
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-gray-500">영화 정보를 불러오는 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="m-8">
            <h2 className="text-2xl font-bold mb-4">{listTitle}</h2>
            <div className="relative">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={16}
                    slidesPerView={2}
                    navigation={{
                        nextEl: `.swiper-button-next-${listTitle.replace(/\s+/g, '-').toLowerCase()}`,
                        prevEl: `.swiper-button-prev-${listTitle.replace(/\s+/g, '-').toLowerCase()}`,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 3,
                        },
                        768: {
                            slidesPerView: 4,
                        },
                        1024: {
                            slidesPerView: 5,
                        },
                        1280: {
                            slidesPerView: 6,
                        },
                    }}
                    className="movie-list-swiper"
                >
                    {movies.map((movie) => (
                        <SwiperSlide key={movie.id}>
                            <MovieCard movie={movie} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* 커스텀 네비게이션 버튼 */}
                {movies.length > 5 && (
                    <>
                        <button
                            className={`swiper-button-prev-${listTitle
                                .replace(/\s+/g, '-')
                                .toLowerCase()} absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-all duration-200 -ml-4`}
                            aria-label="이전 슬라이드"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            className={`swiper-button-next-${listTitle
                                .replace(/\s+/g, '-')
                                .toLowerCase()} absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-all duration-200 -mr-4`}
                            aria-label="다음 슬라이드"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default MovieList;
