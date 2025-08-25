import { useState, useCallback } from 'react';

function MovieCard({ movie }) {
    const [imageError, setImageError] = useState(false);

    // 이미지 에러 처리
    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    // 연도 추출
    const getYear = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).getFullYear();
    };

    // 평점 색상 결정
    const getRatingColor = (rating) => {
        if (rating >= 8) return 'bg-green-500';
        if (rating >= 6) return 'bg-yellow-500';
        if (rating >= 4) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div className="group cursor-pointer">
            {/* 포스터 이미지 */}
            <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg bg-gray-200">
                {!imageError ? (
                    <img
                        src={movie.img}
                        alt={movie.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={handleImageError}
                        loading="lazy"
                    />
                ) : (
                    // 이미지 로드 실패 시 fallback
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <div className="text-center text-gray-600">
                            <div className="text-4xl mb-2">🎬</div>
                            <div className="text-sm px-2">{movie.title}</div>
                        </div>
                    </div>
                )}

                {/* 호버 시 오버레이 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>

                {/* 평점 배지 */}
                {movie.voteAverage > 0 && (
                    <div
                        className={`absolute top-2 right-2 ${getRatingColor(
                            movie.voteAverage
                        )} text-white text-xs font-bold px-2 py-1 rounded-full`}
                    >
                        ★ {movie.voteAverage.toFixed(1)}
                    </div>
                )}
            </div>

            {/* 영화 정보 */}
            <div className="space-y-1">
                {/* 제목 */}
                <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {movie.title}
                </h3>

                {/* 연도 */}
                {movie.releaseDate && <div className="text-xs text-gray-500">{getYear(movie.releaseDate)}</div>}
            </div>
        </div>
    );
}

export default MovieCard;
