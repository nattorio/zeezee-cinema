import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
    const [query, setQuery] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        console.log('검색어:', query);
    };

    return (
        <header className="w-full border-b-4 border-[#F44336] bg-white">
            <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-14">
                <Link to="/" className="flex items-center gap-1 font-bold text-2xl">
                    <span className="text-[#F44336]">NATTORIO</span>
                    <span className="text-black">PEDIA</span>
                </Link>
                <form className="flex-1 flex justify-center" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="콘텐츠, 인물, 컬렉션, 유저, 매거진 검색"
                        className="w-[340px] px-4 py-2 rounded bg-gray-100 text-sm outline-none"
                    />
                </form>
                <div className="flex items-center gap-6 text-gray-700">
                    <button className="text-sm">평가하기</button>
                    <button className="text-sm">소식</button>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="material-icons text-gray-500">person</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
