import Carousel from '../component/MovieList/Carousel';
import MovieList from '../component/MovieList/MovieList';
function HomePage() {
    return (
        <>
            <h1 className="text-3xl font-bold underline">homepage</h1>
            <Carousel />
            <MovieList listTitle="Now Playing" />
            <MovieList listTitle="Upcoming Releases" />
            <MovieList listTitle="Top Rated" />
            <MovieList listTitle="Popular Movies" />
        </>
    );
}

export default HomePage;
