// BannerCarousel.jsx
import { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import createMovies from '../../services/movieService';
import { Link } from 'react-router-dom';

const BannerCarousel = () => {
    const [banners, setBanners] = useState([]);
    const [error, setError] = useState(null);

    const fetchMovies = useCallback(async () => {
        try {
            setError(null);

            const moviesApi = new createMovies(import.meta.env.VITE_TMDB_API_KEY);
            const response = await moviesApi.getUpcomingMovies();

            const upcomingMovies = response.results || response || [];

            if (!Array.isArray(upcomingMovies)) {
                throw new Error('유효하지 않은 API 응답입니다');
            }

            const movieBanners = upcomingMovies
                .filter((movie) => movie.backdrop_path)
                .slice(0, 5)
                .map((movie) => ({
                    id: movie.id,
                    img: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
                    mobileImg: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
                    alt: `${movie.title} 배경 이미지`,
                    title: movie.title || '제목 없음',
                    overview: movie.overview || '줄거리가 없습니다.',
                    releaseDate: movie.release_date || '',
                    voteAverage: movie.vote_average || 0,
                }));

            if (movieBanners.length === 0) {
                throw new Error('표시할 영화가 없습니다');
            }

            setBanners(movieBanners);
        } catch (err) {
            console.error('영화 데이터를 가져오는데 실패했습니다:', err);
            setError(err.message || '영화 데이터를 로드할 수 없습니다.');
        }
    }, []);

    // 이미지 에러 처리
    const handleImageError = useCallback((e, banner) => {
        console.error('이미지 로드 실패:', banner.img);
        e.target.style.display = 'none';
        const parent = e.target.parentElement;
        if (parent) {
            parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
            parent.style.justifyContent = 'center';
            parent.innerHTML = `<div class="text-white text-center"><div class="text-2xl mb-2">🎬</div><div>${banner.title}</div></div>`;
        }
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleRetry = useCallback(() => {
        fetchMovies();
    }, [fetchMovies]);

    // 에러 상태
    if (error) {
        return (
            <section
                className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100"
                role="alert"
                aria-labelledby="banner-error-title"
            >
                <div className="text-center px-6">
                    <h2 id="banner-error-title" className="text-red-600 text-lg font-semibold mb-4">
                        {error}
                    </h2>
                    <button
                        onClick={handleRetry}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                    >
                        다시 시도
                    </button>
                </div>
            </section>
        );
    }

    // 배너가 없는 경우
    if (banners.length === 0) {
        return (
            <section
                className="relative w-full h-[500px] md:h-[700px] bg-gradient-to-br from-gray-800 to-gray-900"
                aria-label="영화 배너를 불러오는 중"
            />
        );
    }

    return (
        <section className="relative w-full h-[500px] md:h-[700px] overflow-hidden" aria-label="추천 영화 배너">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={banners.length > 1}
                autoplay={
                    banners.length > 1
                        ? {
                              delay: 4000,
                              disableOnInteraction: false,
                              pauseOnMouseEnter: true,
                          }
                        : false
                }
                pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-white !opacity-60',
                    bulletActiveClass: 'swiper-pagination-bullet-active !opacity-100',
                }}
                navigation={{
                    nextEl: '.custom-next',
                    prevEl: '.custom-prev',
                }}
                className="w-full h-full"
                breakpoints={{
                    640: {
                        autoplay: { delay: 5000 },
                    },
                }}
                role="region"
                aria-label="영화 배너 슬라이드"
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={banner.id}>
                        <article className="relative w-full h-full group">
                            <figure className="relative w-full h-full">
                                <img
                                    src={banner.img}
                                    srcSet={`${banner.mobileImg} 780w, ${banner.img} 1280w`}
                                    sizes="(max-width: 768px) 100vw, 100vw"
                                    alt={banner.alt}
                                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ objectPosition: '50% 25%' }}
                                    onError={(e) => handleImageError(e, banner)}
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                />

                                {/* 그라데이션 오버레이 */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                                    aria-hidden="true"
                                ></div>
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"
                                    aria-hidden="true"
                                ></div>
                            </figure>

                            {/* 영화 정보 */}
                            <div className="absolute bottom-8 left-8 right-8 z-10 max-w-2xl">
                                <header className="mb-4">
                                    <h1 className="text-white text-2xl md:text-4xl font-bold drop-shadow-2xl mb-4 line-clamp-2">
                                        {banner.title}
                                    </h1>

                                    <div className="flex items-center space-x-4 mb-4">
                                        {banner.voteAverage > 0 && (
                                            <div
                                                className="flex items-center bg-yellow-500 text-black px-3 py-1 rounded-full font-semibold text-sm"
                                                role="img"
                                                aria-label={`평점 ${banner.voteAverage.toFixed(1)}점`}
                                            >
                                                <span aria-hidden="true">★</span>
                                                <span className="ml-1">{banner.voteAverage.toFixed(1)}</span>
                                            </div>
                                        )}
                                        {banner.releaseDate && (
                                            <time className="text-white/90 font-medium" dateTime={banner.releaseDate}>
                                                {new Date(banner.releaseDate).getFullYear()}년
                                            </time>
                                        )}
                                    </div>
                                </header>

                                <p className="text-white/90 text-sm md:text-base leading-relaxed line-clamp-3 drop-shadow-lg mb-6">
                                    {banner.overview}
                                </p>

                                {/* 액션 버튼 */}
                                <nav>
                                    <Link
                                        to={`/movie/${banner.id}`}
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                                        aria-label={`${banner.title} 상세 정보 보기`}
                                    >
                                        자세히 보기
                                    </Link>
                                </nav>
                            </div>
                        </article>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 커스텀 네비게이션 버튼 */}
            {banners.length > 1 && (
                <nav className="absolute top-1/2 left-0 right-0 z-10 flex justify-between px-4 pointer-events-none">
                    <button
                        className="custom-prev bg-black/40 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/60 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 pointer-events-auto"
                        aria-label="이전 영화 배너 보기"
                        type="button"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        className="custom-next bg-black/40 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/60 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 pointer-events-auto"
                        aria-label="다음 영화 배너 보기"
                        type="button"
                    >
                        <svg
                            className="w-6 h-6"
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
        </section>
    );
};

export default BannerCarousel;
