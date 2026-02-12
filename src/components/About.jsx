import React from 'react';

export default function About({ data, theme }) {
    return (
        <section id="about" style={{ position: 'relative' }}>
            {}
            {data.background_image && (
                <>
                    <div className="video-bg" style={{
                        backgroundImage: `url('${data.background_image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'absolute',
                        zIndex: 0
                    }}></div>
                    <div className="video-overlay" style={{
                        zIndex: 1,
                        background: theme === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.7)'
                    }}></div>
                </>
            )}

            <div className="about-minimal-wrapper reveal-up" style={{ position: 'relative', zIndex: 2 }}>

                <div className="about-header">
                    <i className="fa-solid fa-code about-icon-minimal"></i>
                    <h2 id="about-title" className="section-title-minimal">{data.section_title}</h2>
                </div>

                <h3 id="about-headline" className="about-headline-minimal">{data.headline}</h3>

                <div className="about-divider"></div>

                <p id="about-desc" className="about-text-minimal">{data.description}</p>

                <div id="about-est" className="about-est-minimal" dangerouslySetInnerHTML={{ __html: data.est }}></div>
            </div>
        </section>
    );
}
