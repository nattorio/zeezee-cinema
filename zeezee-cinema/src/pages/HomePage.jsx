import Carousel from '../component/MovieList.jsx/carousel';
import MovieList from '../component/MovieList.jsx/MovieList';
function HomePage() {
    return (
        <>
            <h1 className="text-3xl font-bold underline">homepage</h1>
            <Carousel />
            <MovieList />
            <MovieList />
            <MovieList />
        </>
    );
}

export default HomePage;
