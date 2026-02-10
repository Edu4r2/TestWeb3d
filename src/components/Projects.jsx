import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function Projects({ featured, config, children }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const totalSlides = featured.length;
    const slideInterval = useRef(null);
    const gliderRef = useRef(null);
    const isAnimatingRef = useRef(false);
    const prevSlideRef = useRef(0);

    // Dot stride: 12px dot + 15px gap = 27px
    const STRIDE = 27;
    const DOT_SIZE = 12;
    const GLIDER_REST_WIDTH = 24;
    const GLIDER_OFFSET = (GLIDER_REST_WIDTH - DOT_SIZE) / 2; // 6px

    const animateWorm = useCallback((from, to) => {
        const glider = gliderRef.current;
        if (!glider || from === to) return;

        isAnimatingRef.current = true;
        const goingForward = to > from;

        // Positions in px (left edge of the glider at rest over each dot)
        const fromPos = from * STRIDE - GLIDER_OFFSET;
        const toPos = to * STRIDE - GLIDER_OFFSET;

        // Phase durations
        const P1 = 300;
        const P2 = 300;

        // Disable CSS transition, reset to starting position
        glider.style.transition = 'none';

        if (goingForward) {
            // Start: glider at "from" position
            glider.style.left = fromPos + 'px';
            glider.style.width = GLIDER_REST_WIDTH + 'px';

            requestAnimationFrame(() => {
                // Phase 1: left stays, right edge stretches toward target
                glider.style.transition = `width ${P1}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                glider.style.width = (toPos + GLIDER_REST_WIDTH - fromPos) + 'px';

                setTimeout(() => {
                    // Phase 2: left catches up to target, width shrinks
                    glider.style.transition = `left ${P2}ms cubic-bezier(0.4, 0, 0.2, 1), width ${P2}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                    glider.style.left = toPos + 'px';
                    glider.style.width = GLIDER_REST_WIDTH + 'px';

                    setTimeout(() => {
                        isAnimatingRef.current = false;
                    }, P2);
                }, P1);
            });
        } else {
            // Start: glider at "from" position
            glider.style.left = fromPos + 'px';
            glider.style.width = GLIDER_REST_WIDTH + 'px';

            requestAnimationFrame(() => {
                // Phase 1: right stays, left edge stretches toward target
                glider.style.transition = `left ${P1}ms cubic-bezier(0.4, 0, 0.2, 1), width ${P1}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                glider.style.left = toPos + 'px';
                glider.style.width = (fromPos + GLIDER_REST_WIDTH - toPos) + 'px';

                setTimeout(() => {
                    // Phase 2: right edge contracts to target, width shrinks
                    glider.style.transition = `width ${P2}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                    glider.style.width = GLIDER_REST_WIDTH + 'px';

                    setTimeout(() => {
                        isAnimatingRef.current = false;
                    }, P2);
                }, P1);
            });
        }
    }, [STRIDE, GLIDER_REST_WIDTH, GLIDER_OFFSET]);

    const changeSlide = useCallback((newIndex) => {
        const from = prevSlideRef.current;
        prevSlideRef.current = newIndex;
        setCurrentSlide(newIndex);
        animateWorm(from, newIndex);
    }, [animateWorm]);

    const nextSlide = useCallback(() => {
        const next = (prevSlideRef.current + 1) % totalSlides;
        changeSlide(next);
    }, [totalSlides, changeSlide]);

    const previousSlide = useCallback(() => {
        const prev = (prevSlideRef.current - 1 + totalSlides) % totalSlides;
        changeSlide(prev);
    }, [totalSlides, changeSlide]);

    const goToSlide = useCallback((index) => {
        if (index === prevSlideRef.current) return;
        changeSlide(index);
    }, [changeSlide]);

    // Set initial glider position
    useEffect(() => {
        const glider = gliderRef.current;
        if (glider) {
            glider.style.left = (0 * STRIDE - GLIDER_OFFSET) + 'px';
            glider.style.width = GLIDER_REST_WIDTH + 'px';
        }
    }, []);

    useEffect(() => {
        const isUltraWide = window.matchMedia('(min-width: 2000px)').matches;
        if (totalSlides > 1 && !isPaused && !isUltraWide) {
            slideInterval.current = setInterval(nextSlide, 3500);
        }
        return () => {
            if (slideInterval.current) clearInterval(slideInterval.current);
        };
    }, [totalSlides, isPaused, nextSlide]);

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

                <button className="carousel-btn prev-btn" onClick={previousSlide}><i className="fa-solid fa-chevron-left"></i></button>
                <button className="carousel-btn next-btn" onClick={nextSlide}><i className="fa-solid fa-chevron-right"></i></button>

                <div id="carousel-dots" className="carousel-indicators">
                    {/* Neon Glider: JS-driven worm animation */}
                    <div ref={gliderRef} className="indicator-glider"></div>

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
