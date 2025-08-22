// BannerCarousel.jsx
import { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import createMovies from '../../services/movieService';

const BannerCarousel = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMovies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const moviesApi = new createMovies(import.meta.env.VITE_TMDB_API_KEY);
            const response = await moviesApi.getUpcomingMovies();

            const popularMovies = response.results || response || [];

            // API 응답 유효성 검사
            if (!Array.isArray(popularMovies)) {
                throw new Error('유효하지 않은 API 응답입니다');
            }

            // TMDB 이미지 URL을 올바르게 구성
            const movieBanners = popularMovies
                .filter((movie) => movie.backdrop_path) // backdrop_path가 있는 영화만 필터링
                .slice(0, 5) // 상위 5개 영화만 선택
                .map((movie) => {
                    return {
                        id: movie.id,
                        img: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
                        mobileImg: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
                        alt: movie.title || '영화 포스터',
                        title: movie.title || '제목 없음',
                        overview: movie.overview || '줄거리가 없습니다.',
                        releaseDate: movie.release_date || '',
                        voteAverage: movie.vote_average || 0,
                    };
                });

            if (movieBanners.length === 0) {
                throw new Error('표시할 영화가 없습니다');
            }

            setBanners(movieBanners);
        } catch (err) {
            console.error('영화 데이터를 가져오는데 실패했습니다:', err);
            setError(err.message || '영화 데이터를 로드할 수 없습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    // 재시도 함수
    const handleRetry = () => {
        fetchMovies();
    };

    // 로딩 상태
    if (loading) {
        return (
            <div className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <div className="text-gray-600 font-medium">영화 정보를 불러오고 있습니다...</div>
                </div>
            </div>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <div className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                <div className="text-center px-6">
                    <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
                    <button
                        onClick={handleRetry}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    // 배너가 없는 경우
    if (banners.length === 0) {
        return (
            <div className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center px-6">
                    <div className="text-gray-600 text-lg font-semibold mb-4">사용 가능한 배너가 없습니다</div>
                    <button
                        onClick={handleRetry}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        새로고침
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={banners.length > 1} // 배너가 1개일 때는 loop 비활성화
                autoplay={
                    banners.length > 1
                        ? {
                              delay: 4000,
                              disableOnInteraction: false,
                              pauseOnMouseEnter: true, // 마우스 호버 시 일시정지
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
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={banner.id}>
                        <div className="relative w-full h-full group">
                            {/* 이미지 */}
                            <img
                                src={banner.img}
                                srcSet={`${banner.mobileImg} 780w, ${banner.img} 1280w`}
                                sizes="(max-width: 768px) 100vw, 100vw"
                                alt={banner.alt}
                                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                style={{ objectPosition: '50% 25%' }}
                                onError={(e) => {
                                    console.error('이미지 로드 실패:', banner.img);
                                    e.target.src = '/placeholder-image.jpg';
                                }}
                                loading={index === 0 ? 'eager' : 'lazy'} // 첫 번째 이미지만 즉시 로드
                            />

                            {/* 그라데이션 오버레이 */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>

                            {/* 영화 정보 */}
                            <div className="absolute bottom-8 left-8 right-8 z-10 max-w-2xl">
                                <h2 className="text-white text-2xl md:text-4xl font-bold drop-shadow-2xl mb-4 line-clamp-2">
                                    {banner.title}
                                </h2>

                                <div className="flex items-center space-x-4 mb-4">
                                    {banner.voteAverage > 0 && (
                                        <div className="flex items-center bg-yellow-500 text-black px-3 py-1 rounded-full font-semibold text-sm">
                                            <span>★</span>
                                            <span className="ml-1">{banner.voteAverage.toFixed(1)}</span>
                                        </div>
                                    )}
                                    {banner.releaseDate && (
                                        <div className="text-white/90 font-medium">
                                            {new Date(banner.releaseDate).getFullYear()}
                                        </div>
                                    )}
                                </div>

                                <p className="text-white/90 text-sm md:text-base leading-relaxed line-clamp-3 drop-shadow-lg">
                                    {banner.overview}
                                </p>

                                {/* 액션 버튼 */}
                                <div className="flex space-x-4 mt-6">
                                    <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200">
                                        자세히 보기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 커스텀 네비게이션 버튼 - 배너가 여러 개일 때만 표시 */}
            {banners.length > 1 && (
                <>
                    <button
                        className="custom-prev absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/40 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/60 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="이전 슬라이드"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        className="custom-next absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/40 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/60 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="다음 슬라이드"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
};

export default BannerCarousel;
