import React from 'react';

export default function About({ data, theme }) {
    return (
        <section id="about" style={{ position: 'relative' }}>
            { }
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
                    <div className="about-logo-wrapper">
                        <img src="media/logoW.png" alt="Edu4rt Store Logo" className="about-logo glitch-base" />
                        <img src="media/logoW.png" aria-hidden="true" className="about-logo glitch-layer layer-1" />
                        <img src="media/logoW.png" aria-hidden="true" className="about-logo glitch-layer layer-2" />
                    </div>
                    <h2 id="about-title" className="section-title-minimal">{data.section_title}</h2>
                </div>

                <h3 id="about-headline" className="about-headline-minimal">{data.headline}</h3>

                <div className="about-divider"></div>

                <p id="about-desc" className="about-text-minimal">{data.description}</p>

                <div id="about-est" className="about-est-minimal" dangerouslySetInnerHTML={{ __html: data.est }}></div>

                {data.trusted_stores && (
                    <div className="trusted-stores-container">
                        <p className="trusted-title">{data.trusted_title}</p>
                        <div className="trusted-logos">
                            {data.trusted_stores.map((store, index) => (
                                <a key={index} href={store.link} target="_blank" rel="noopener noreferrer" className="store-link" style={{ animationDelay: `${index * 0.2}s` }}>
                                    <img src={store.img} alt={store.name} className={`store-logo ${store.img.endsWith('.svg') ? 'logo-svg' : ''}`} />
                                    <span className="store-tooltip">{store.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
