import { useState } from 'react';

function StarRating({ max = 5, step = 0.5, onChange }) {
    const [hovered, setHovered] = useState(0);
    const [selected, setSelected] = useState(0);

    const stars = [];
    const totalStars = max / step;

    for (let i = 1; i <= totalStars; i++) {
        const value = i * step;
        stars.push(
            <span
                key={value}
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => {
                    setSelected(value);
                    if (onChange) onChange(value);
                }}
                style={{
                    cursor: 'pointer',
                    color: (hovered || selected) >= value ? '#FFD700' : '#ccc',
                    fontSize: '2rem',
                }}
            >
                {i % 2 === 0 ? '★' : '☆'}
            </span>
        );
    }

    return (
        <div>
            {stars}
            <div>별점: {selected}</div>
        </div>
    );
}

export default StarRating;
