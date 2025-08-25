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
    let sectionTitle = '';
    if (listTitle === 'Now Playing') {
        sectionTitle = '현재 상영작';
    } else if (listTitle === 'Upcoming Releases') {
        sectionTitle = '개봉 예정작';
    } else if (listTitle === 'Popular Movies') {
        sectionTitle = '인기 영화';
    } else if (listTitle === 'Top Rated') {
        sectionTitle = '최고 평점 영화';
    }
    const fetchMovies = useCallback(async () => {
        try {
            setError(null);

            const moviesApi = new createMovies(import.meta.env.VITE_TMDB_API_KEY);
            let response;

            if (listTitle === 'Now Playing') {
                response = await moviesApi.getNowPlayingMovies();
                listTitle = '현재 상영작';
            } else if (listTitle === 'Upcoming Releases') {
                response = await moviesApi.getUpcomingMovies();
                listTitle = '개봉 예정작';
            } else if (listTitle === 'Popular Movies') {
                response = await moviesApi.getPopularMovies();
                listTitle = '인기 영화';
            } else if (listTitle === 'Top Rated') {
                response = await moviesApi.getTopRatedMovies();
                listTitle = '최고 평점 영화';
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
                    alt: `${movie.title} 포스터`,
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

    const sectionId = sectionTitle.replace(/\s+/g, '-').toLowerCase();

    if (error) {
        return (
            <section className="mb-8" aria-labelledby={`${sectionId}-title`}>
                <header>
                    <h2 id={`${sectionId}-title`} className="text-2xl font-bold mb-4">
                        {sectionTitle}
                    </h2>
                </header>
                <div
                    className="flex items-center justify-center h-32 bg-red-50 rounded-lg"
                    role="alert"
                    aria-live="polite"
                >
                    <div className="text-center">
                        <p className="text-red-600 mb-2">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                            type="button"
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (movies.length === 0) {
        return (
            <section className="mb-8" aria-labelledby={`${sectionId}-title`}>
                <header>
                    <h2 id={`${sectionId}-title`} className="text-2xl font-bold mb-4">
                        {sectionTitle}
                    </h2>
                </header>
                <div
                    className="h-32 bg-gray-100 rounded-lg flex items-center justify-center"
                    aria-live="polite"
                    aria-label={`${listTitle} 영화 목록을 불러오는 중`}
                >
                    <p className="text-gray-500">영화 정보를 불러오는 중...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="m-8" aria-labelledby={`${sectionId}-title`}>
            <header>
                <h2 id={`${sectionId}-title`} className="text-2xl font-bold mb-4">
                    {sectionTitle}
                </h2>
            </header>

            <div className="relative">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={16}
                    slidesPerView={2}
                    navigation={{
                        nextEl: `.swiper-button-next-${sectionId}`,
                        prevEl: `.swiper-button-prev-${sectionId}`,
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
                    role="region"
                    aria-label={`${sectionTitle} 영화 목록`}
                >
                    {movies.map((movie) => (
                        <SwiperSlide key={movie.id}>
                            <MovieCard movie={movie} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* 커스텀 네비게이션 버튼 */}
                {movies.length > 5 && (
                    <nav
                        className="absolute top-1/2 left-0 right-0 z-10 flex justify-between pointer-events-none"
                        aria-label={`${sectionTitle} 목록 네비게이션`}
                    >
                        <button
                            className={`swiper-button-prev-${sectionId} bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-all duration-200 -ml-4 pointer-events-auto`}
                            aria-label={`${sectionTitle} 이전 영화들 보기`}
                            type="button"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            className={`swiper-button-next-${sectionId} bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-all duration-200 -mr-4 pointer-events-auto`}
                            aria-label={`${sectionTitle} 다음 영화들 보기`}
                            type="button"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </nav>
                )}
            </div>
        </section>
    );
}

export default MovieList;
