import { useEffect, useState } from 'react';
import { createMovies } from '../../../services/movieService';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const moviesApi = createMovies(apiKey);

function MovieBanner() {
    const [images, setImages] = useState([]);
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMovieData() {
            try {
                const movieData = await moviesApi.getMovieDetails(980489, 'ko-KR');
                setMovie(movieData);

                const imageData = await moviesApi.getMovieImages(980489, 'en');
                setImages(imageData.backdrops);
            } catch (err) {
                setError('영화 정보를 불러올 수 없습니다.');
            }
        }
        fetchMovieData();
    }, []);

    if (error) return <div className="text-red-500">{error}</div>;
    if (!movie || images.length === 0) return <div>로딩 중...</div>;

    return (
        <div className="relative w-full h-[400px]">
            <img
                src={images.length > 0 ? `https://image.tmdb.org/t/p/w1280${images[0].file_path}` : '/assets/error.png'}
                alt={movie?.title || '배너 없음'}
                className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full  bg-opacity-40" />
            <div className="absolute top-10 left-10 bg-opacity-60 p-6 rounded-lg text-white max-w-md">
                <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
                <p className="mb-1">
                    {movie?.original_title} | {movie?.release_date} | {movie?.runtime}분 | 평점 {movie?.vote_average}
                </p>
            </div>
        </div>
    );
}

export default MovieBanner;
