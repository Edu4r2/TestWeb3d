import React, { useState, useEffect, useRef } from 'react';

export default function Projects({ featured, config, children }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [prevSlide, setPrevSlide] = useState(0);
    const totalSlides = featured.length;
    const slideInterval = useRef(null);

    const nextSlide = () => {
        setPrevSlide(currentSlide);
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const previousSlide = () => {
        setPrevSlide(currentSlide);
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (index) => {
        if (index === currentSlide) return;
        setPrevSlide(currentSlide);
        setCurrentSlide(index);
    };

    useEffect(() => {
        const isUltraWide = window.matchMedia('(min-width: 2000px)').matches;
        if (totalSlides > 1 && !isPaused && !isUltraWide) {
            slideInterval.current = setInterval(nextSlide, 3500);
        }
        return () => {
            if (slideInterval.current) clearInterval(slideInterval.current);
        };
    }, [totalSlides, isPaused]);

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
                        <div key={index} className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}>
                            <div className={`featured-split ${index % 2 !== 0 ? 'reversed' : ''}`}>
                                <div className="featured-text-col">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <a href={item.link || '#'} className="featured-btn">
                                        {item.btn_text || 'Ver Más'}
                                    </a>
                                </div>
                                <div className="featured-img-col">
                                    <img src={item.img} alt={item.title} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="carousel-btn prev-btn" onClick={previousSlide}><i className="fa-solid fa-chevron-left"></i></button>
                <button className="carousel-btn next-btn" onClick={nextSlide}><i className="fa-solid fa-chevron-right"></i></button>

                <div id="carousel-dots" className="carousel-indicators">
                    {/* Neon Glider: Absolute pill that slides over dots with elastic worm animation */}
                    <div
                        className="indicator-glider"
                        data-direction={currentSlide > prevSlide ? 'forward' : 'backward'}
                        style={{
                            transform: `translateX(${currentSlide * 27}px)`
                        }}
                    ></div>

                    {/* Static track dots */}
                    {featured.map((_, i) => (
                        <div key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => goToSlide(i)}></div>
                    ))}
                </div>
            </div>

            {children}
        </section>
    );
}
