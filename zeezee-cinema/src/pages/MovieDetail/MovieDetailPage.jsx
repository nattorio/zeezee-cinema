import { useEffect, useState } from 'react';
import { createMovies } from '../../services/movieService';
import MovieBanner from './component/Moviebanner';
import MovieInfo from './component/MovieInfo';
import CardGrid from './component/CardGrid';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const moviesApi = createMovies(apiKey);

function MovieDetailPage() {
    const [credits, setCredits] = useState([]);

    useEffect(() => {
        async function fetchCredits() {
            const creditsData = await moviesApi.getMovieCredits(299534, 'ko-KR');
            setCredits(creditsData.cast || []);
        }
        fetchCredits();
    }, []);

    return (
        <>
            <MovieBanner />
            <MovieInfo />
            <CardGrid castList={credits} />
        </>
    );
}

export default MovieDetailPage;
