import React, { useState } from 'react';

export default function CategoryCard({ category, index, onOpenModal }) {
    const [activating, setActivating] = useState(false);

    const handleClick = (e) => {
        setActivating(true);
        setTimeout(() => {
            onOpenModal(category.id);
            setTimeout(() => { setActivating(false); }, 500);
        }, 350);
    };

    return (
        <div className={`card-perspective-wrapper js-glow-container reveal-up delay-${(index + 1) * 100}`}>
            <div className="ambient-glow" style={{ backgroundImage: `url(${category.img})` }}></div>
            <div className={`glass-card ${activating ? 'card-activating' : ''}`} onClick={handleClick}>
                <img src={category.img} alt={category.title} />
                <div className="card-body">
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                </div>
            </div>
        </div>
    );
}
