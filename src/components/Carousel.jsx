import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWormAnimation } from '../hooks/useWormAnimation';

export default function Carousel({ items, config }) {
    const [isPaused, setIsPaused] = useState(false);
    const { currentIndex, gliderRef, next, prev, goTo } = useWormAnimation(items.length);

    useEffect(() => {
        const isUltraWide = window.matchMedia('(min-width: 2000px)').matches;
        if (items.length > 1 && !isPaused && !isUltraWide) {
            const interval = setInterval(next, 3500);
            return () => clearInterval(interval);
        }
    }, [items.length, isPaused, next]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 2000) {
                setIsPaused(true);
            } else {
                setIsPaused(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="carousel-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

            <div className="carousel-track">
                {items.map((item, index) => (
                    <div key={index} className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}>
                        <div className={`featured-split ${index % 2 !== 0 ? 'reversed' : ''}`}>
                            <div className="featured-text-col">
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <div
                                    onClick={() => {
                                        const target = item.link || '#';
                                        if (target.startsWith('#')) {
                                            document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            window.open(target, '_blank');
                                        }
                                    }}
                                    className="featured-btn"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item.btn_text || 'Ver Más'}
                                </div>
                            </div>
                            <div className="featured-img-col">
                                <img src={item.img} alt={item.title} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="carousel-btn prev-btn" onClick={prev}><i className="fa-solid fa-chevron-left"></i></button>
            <button className="carousel-btn next-btn" onClick={next}><i className="fa-solid fa-chevron-right"></i></button>

            <div id="carousel-dots" className="carousel-indicators">
                <div ref={gliderRef} className="indicator-glider"></div>
                {items.map((_, i) => (
                    <div key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} onClick={() => goTo(i)}></div>
                ))}
            </div>
        </div>
    );
}
