import { useEffect, useState } from 'react';
import { createMovies } from '../../../services/movieService';
import { useParams } from 'react-router-dom';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const moviesApi = createMovies(apiKey);

function MovieBanner() {
    const [images, setImages] = useState([]);
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const { movieId } = useParams();

    useEffect(() => {
        async function fetchMovieData() {
            try {
                const movieData = await moviesApi.getMovieDetails(movieId, 'ko-KR');
                setMovie(movieData);

                const imageData = await moviesApi.getMovieImages(movieId, 'en');
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
            <div className="absolute bottom-10 left-10 text-white">
                <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
                <p className="mb-1">
                    {movie?.original_title} | {movie?.release_date} | {movie?.runtime}분 | 평점 {movie?.vote_average}
                </p>
            </div>
        </div>
    );
}

export default MovieBanner;
