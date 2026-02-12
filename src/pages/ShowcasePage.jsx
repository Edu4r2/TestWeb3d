import React from 'react';
import GlobalNav from '../components/GlobalNav';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import contentData from '../data/content.json';
import { useRevealObserver } from '../hooks/useRevealObserver';

export default function ShowcasePage({ theme, toggleTheme }) {
    const config = contentData.config;
    const ui = contentData.ui;
    const showcaseData = contentData.showcase;

    const backgroundStyle = ui.projects_bg
        ? { backgroundImage: `url('/${ui.projects_bg}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
        : { backgroundColor: 'var(--bg-body)' };
    useRevealObserver();

    return (
        <div className="showcase-page" style={{ minHeight: '100vh', ...backgroundStyle }}>
            <GlobalNav config={ui} toggleTheme={toggleTheme} theme={theme} />

            <div style={{ paddingTop: '20px', paddingBottom: '80px' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <h1 className="section-title reveal-up" style={{ marginTop: '40px', marginBottom: '40px', textAlign: 'center' }}>
                        {ui.titles.featured || "Showcase"}
                    </h1>

                    {showcaseData.map((carouselGroup, index) => (
                        <section
                            key={carouselGroup.id || index}
                            id={carouselGroup.id}
                            className="showcase-section"
                            style={{ marginBottom: '80px', scrollMarginTop: '160px' }}
                        >
                            <h2 className="reveal-up" style={{
                                fontSize: '2rem',
                                marginBottom: '30px',
                                borderLeft: '4px solid var(--accent)',
                                paddingLeft: '15px',
                                color: 'var(--text-main)'
                            }}>
                                {carouselGroup.title}
                            </h2>
                            <div className="reveal-up delay-100">
                                <Carousel items={carouselGroup.items} config={ui} />
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            <Footer text={ui.footer} />
        </div>
    );
}
