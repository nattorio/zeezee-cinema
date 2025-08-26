import { useState, useEffect } from 'react';

import { createMovies } from '../../../services/movieService';

import StarRating from './StarRating';
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
        <div className="flex flex-col items-center w-full mt-[30px] mx-2">
            <div className="md:flex gap-0.5 mt-[30px] max-w-5xl">
                <div className="flex-3/5 flex-col">
                    <img
                        src={
                            images.length > 0
                                ? `https://image.tmdb.org/t/p/w1280${images[0].file_path}`
                                : '/assets/error.png'
                        }
                        alt={movie?.title || '배너 없음'}
                        className="w-[280px] aspect-auto object-cover"
                    />
                    <p>별점 그래프</p>
                    <p>
                        평균 ⭐️{movie.vote_average.toFixed}({movie.vote_count}명)
                    </p>
                </div>
                <div className="flex-col md:flex-row ml-5 max-w-7xl">
                    <div className="flex flex-col">
                        <div className="flex w-full">
                            <div className="flex-1">
                                <div className=" flex-col items-start">
                                    <StarRating max={5} step={0.5} onChange={(score) => console.log(score)} />
                                    <p>평가하기</p>
                                </div>
                            </div>
                            <div className="flex-1 items-center">
                                <div className="w-full flex flex-col items-center gap-3">
                                    <span className="text-5xl font-bold text-gray-400">
                                        {movie.vote_average.toFixed(1)}
                                    </span>
                                    <p>평균 별점({movie.vote_count}명)</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <button type="button">보고싶어요</button>
                            <button type="button">코멘트</button>
                            <button type="button">보는 중</button>
                            <button type="button">...더보기</button>
                        </div>
                    </div>
                    <p className=" mt-5 text-gray-600 pr-3">{movie.overview}</p>
                </div>
            </div>
        </div>
    );
}
export default MovieInfo;
