import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWormAnimation } from '../hooks/useWormAnimation';

export default function Projects({ featured, config, children }) {
    const [isPaused, setIsPaused] = useState(false);
    const { currentIndex, gliderRef, next, prev, goTo } = useWormAnimation(featured.length);
    const navigate = useNavigate();

    useEffect(() => {
        const isUltraWide = window.matchMedia('(min-width: 2000px)').matches;
        if (featured.length > 1 && !isPaused && !isUltraWide) {
            const interval = setInterval(next, 3500);
            return () => clearInterval(interval);
        }
    }, [featured.length, isPaused, next]);

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

    const projectsStyle = config.projects_bg
        ? { '--projects-bg': `url('/${config.projects_bg}')` }
        : {};

    return (
        <section id="projects" className={config.projects_bg ? 'has-custom-bg' : ''} style={projectsStyle}>
            <div className="carousel-container"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}>

                <div id="featured-track" className="carousel-track">
                    {featured.map((item, index) => (
                        <div key={index} className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}>
                            <div className={`featured-split ${index % 2 !== 0 ? 'reversed' : ''}`}>
                                <div className="featured-text-col">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <div
                                        onClick={() => {
                                            const target = item.link || '#';
                                            if (target.startsWith('/')) {
                                                navigate(target);
                                                window.scrollTo(0, 0);
                                            } else if (target.startsWith('#')) {
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
                                    {item.video ? (
                                        <video
                                            src={item.video}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="featured-video"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <img src={item.img} alt={item.title} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="carousel-btn prev-btn" onClick={prev}><i className="fa-solid fa-chevron-left"></i></button>
                <button className="carousel-btn next-btn" onClick={next}><i className="fa-solid fa-chevron-right"></i></button>

                <div id="carousel-dots" className="carousel-indicators">
                    <div ref={gliderRef} className="indicator-glider"></div>
                    {featured.map((_, i) => (
                        <div key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} onClick={() => goTo(i)}></div>
                    ))}
                </div>
            </div>

            {children}
        </section>
    );
}
