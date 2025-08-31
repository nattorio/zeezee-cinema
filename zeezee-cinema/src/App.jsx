import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetail/MovieDetailPage';
import Header from './component/common/Header';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:movieId" element={<MovieDetailPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
