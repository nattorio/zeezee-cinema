import { useEffect, useState } from 'react';
import { createMovies } from '../../../services/movieService';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const moviesApi = createMovies(apiKey);

function CastCard() {
    const [credits, setCredits] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMovieData() {
            try {
                const creditsData = await moviesApi.getMovieCredits(299534, 'ko-KR');
                setCredits(creditsData.cast || []);
            } catch (err) {
                setError('영화 정보를 불러올 수 없습니다.');
            }
        }
        fetchMovieData();
    }, []);

    function RenderCredits({ data }) {
        return (
            <div key={data.id}>
                <img
                    src={
                        data.profile_path ? `https://image.tmdb.org/t/p/w185${data.profile_path}` : '/assets/error.png'
                    }
                    alt={data.name}
                    className="w-[80px] aspect-auto"
                />
                <p>{data.name}</p>
                <p>{data.known_for_department}</p>
            </div>
        );
    }

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <article>
            {credits.slice(0, 12).map((data) => (
                <RenderCredits key={data.id} data={data} />
            ))}
        </article>
    );
}

export default CastCard;
