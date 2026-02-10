import React, { useState, useEffect } from 'react';
import GlobalNav from './components/GlobalNav';
import { useActiveSection } from './hooks/useActiveSection';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Projects from './components/Projects';
import ModalManager from './components/ModalManager';
import Footer from './components/Footer';
import ParticleCanvas from './components/ParticleCanvas';
import contentData from './data/content.json';

// Import CSS
import './index.css';

function App() {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme : 'dark';
    });
    const [activeModalId, setActiveModalId] = useState(null);
    const activeSection = useActiveSection();

    useEffect(() => {
        // Load Fonts from Config
        const { typography } = contentData.config;

        // 1. Load Main Font
        if (typography.font_import_url) {
            const link = document.createElement('link');
            link.href = typography.font_import_url;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            document.documentElement.style.setProperty('--main-font', typography.font_family);
        }

        // 2. Load Hero Font
        if (typography.hero_font_import_url) {
            const linkHero = document.createElement('link');
            linkHero.href = typography.hero_font_import_url;
            linkHero.rel = 'stylesheet';
            document.head.appendChild(linkHero);
            document.documentElement.style.setProperty('--hero-font', typography.hero_font_family);
        } else {
            // Fallback to main font if no hero font specified
            document.documentElement.style.setProperty('--hero-font', typography.font_family);
        }

    }, []);

    useEffect(() => {
        // Apply theme
        if (theme === 'light') {
            document.body.setAttribute('data-theme', 'light');
        } else {
            document.body.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };


    // Reveal Animation Observer
    useEffect(() => {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

        return () => revealObserver.disconnect();
    }); // Run on every render to catch new elements or assume structure is static? 
    // Better: Run once or when location changes. Since content is static, once is fine.
    // But verify if components mount later. Components mount on initial render.

    // Side Indicators Logic (Simplified port)
    // Replaced by useActiveSection hook

    const config = contentData.config;
    const ui = contentData.ui;
    const categories = contentData.categories;
    const featured = contentData.featured;

    return (
        <>
            <GlobalNav config={contentData.ui} toggleTheme={toggleTheme} theme={theme} />

            <div id="side-indicators" className={`side-indicator ${activeSection === 'hero' ? 'hero-mode' : ''}`}>
                {ui.navbar.items.map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        className={`indicator-dot ${activeSection === item.href.substring(1) ? 'active' : ''}`}
                        aria-label={item.label}
                    ></a>
                ))}
            </div>

            <Hero data={ui.hero} />
            <About data={ui.about} theme={theme} />

            {/* Products Render */}
            <div style={{ position: 'relative' }}>
                <ParticleCanvas theme={theme} />
                <Products config={ui} categories={categories} onOpenModal={setActiveModalId} />
            </div>

            <Projects featured={featured} config={ui}>
                <Footer text={ui.footer} />
            </Projects>

            <ModalManager
                activeModalId={activeModalId}
                onClose={() => setActiveModalId(null)}
                categories={categories}
            />
        </>
    );
}

export default App;
