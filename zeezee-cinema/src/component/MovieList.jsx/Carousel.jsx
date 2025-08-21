// BannerCarousel.jsx
import { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const moviesApi = new createMovies(import.meta.env.VITE_TMDB_API_KEY);
                const response = await moviesApi.getUpcomingMovies();

                console.log('API 응답:', response); // 디버깅을 위한 로그

                // API 응답에서 실제 영화 배열 추출
                const popularMovies = response.results || response || [];

                // TMDB 이미지 URL을 올바르게 구성
                const movieBanners = popularMovies
                    .filter((movie) => movie.backdrop_path) // backdrop_path가 있는 영화만 필터링
                    .slice(0, 5) // 상위 5개 영화만 선택
                    .map((movie) => ({
                        id: movie.id,
                        img: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
                        alt: movie.title,
                        title: movie.title,
                    }));

                setBanners(movieBanners);
            } catch (err) {
                console.error('영화 데이터를 가져오는데 실패했습니다:', err);
                setError('영화 데이터를 로드할 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return (
            <div className="relative w-full h-[500px] flex items-center justify-center bg-gray-200">
                <div className="text-gray-600">로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative w-full h-[500px] flex items-center justify-center bg-gray-200">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    if (banners.length === 0) {
        return (
            <div className="relative w-full h-[500px] flex items-center justify-center bg-gray-200">
                <div className="text-gray-600">사용 가능한 배너가 없습니다</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[500px]">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active',
                }}
                navigation={{
                    nextEl: '.custom-next',
                    prevEl: '.custom-prev',
                }}
                className="w-full h-full"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <div className="relative w-full h-full">
                            <img
                                src={banner.img}
                                alt={banner.alt}
                                className="w-full h-full object-cover object-center"
                                style={{ objectPosition: '50% 30%' }}
                                onError={(e) => {
                                    e.target.src = '/placeholder-image.jpg'; // 기본 이미지로 대체
                                }}
                            />
                            {/* 그라데이션 오버레이 (선택사항) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                            {/* 영화 제목 표시 (선택사항) */}
                            <div className="absolute bottom-8 left-8 z-10">
                                <h2 className="text-white text-3xl font-bold drop-shadow-lg">{banner.title}</h2>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 커스텀 네비게이션 버튼 */}
            <button
                className="custom-prev absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-all duration-200 hover:scale-110"
                aria-label="이전 슬라이드"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                className="custom-next absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-all duration-200 hover:scale-110"
                aria-label="다음 슬라이드"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default BannerCarousel;
