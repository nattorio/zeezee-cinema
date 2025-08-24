import { useState, useEffect } from 'react';

import { createMovies } from '../../../services/movieService';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const moviesApi = createMovies(apiKey);

function MovieInfo() {
    const [images, setImages] = useState([]);
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMovieData() {
            try {
                const movieData = await moviesApi.getMovieDetails(299534, 'ko-KR');
                setMovie(movieData);

                const imageData = await moviesApi.getMovieImages(299534, 'en');
                setImages(imageData.posters);
            } catch (err) {
                setError('영화 정보를 불러올 수 없습니다.');
            }
        }
        fetchMovieData();
    }, []);

    if (error) return <div className="text-red-500">{error}</div>;
    if (!movie || images.length === 0) return <div>로딩 중...</div>;

    return (
        <>
            <img
                src={images.length > 0 ? `https://image.tmdb.org/t/p/w1280${images[0].file_path}` : '/assets/error.png'}
                alt={movie?.title || '배너 없음'}
                className="w-[280px] aspect-auto object-cover"
            />
            <p>별점 그래프</p>
            <p>
                평균 ⭐️{movie.vote_average}({movie.vote_count}명)
            </p>
            <div className="flex">
                <div>
                    <span>⭐️⭐️⭐️⭐️⭐️</span>
                    <p>평가하기</p>
                    <span>{movie.vote_average}</span>
                    <p>평균 별점({movie.vote_count}명)</p>
                </div>
                <div>
                    <button type="button">보고싶어요</button>
                    <button type="button">코멘트</button>
                    <button type="button">보는 중</button>
                    <button type="button">...더보기</button>
                </div>
            </div>
        </>
    );
}
export default MovieInfo;
