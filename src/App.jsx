import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import GlobalNav from './components/GlobalNav';
import { useActiveSection } from './hooks/useActiveSection';
import { useRevealObserver } from './hooks/useRevealObserver';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Projects from './components/Projects';
import ModalManager from './components/ModalManager';
import Footer from './components/Footer';
import ParticleCanvas from './components/ParticleCanvas';
import ShowcasePage from './pages/ShowcasePage';
import contentData from './data/content.json';

import './index.css';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function Home({ theme, toggleTheme, activeModalId, setActiveModalId, activeSection }) {
    const ui = contentData.ui;
    const categories = contentData.categories;
    const featured = contentData.featured;

    return (
        <>
            <GlobalNav config={contentData.ui} toggleTheme={toggleTheme} theme={theme} />

            <div id="side-indicators" className={`side-indicator ${activeSection === 'hero' ? 'hero-mode' : ''}`}>
                {ui.navbar.items.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`indicator-dot ${activeSection === item.href.substring(1) ? 'active' : ''}`}
                        aria-label={item.label}
                    ></div>
                ))}
            </div>

            <Hero data={ui.hero} />
            <About data={ui.about} theme={theme} />

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

function App() {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme : 'dark';
    });
    const [activeModalId, setActiveModalId] = useState(null);
    const activeSection = useActiveSection();

    useEffect(() => {
        const { typography } = contentData.config;

        if (typography.font_import_url) {
            const link = document.createElement('link');
            link.href = typography.font_import_url;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            document.documentElement.style.setProperty('--main-font', typography.font_family);
        }

        if (typography.hero_font_import_url) {
            const linkHero = document.createElement('link');
            linkHero.href = typography.hero_font_import_url;
            linkHero.rel = 'stylesheet';
            document.head.appendChild(linkHero);
            document.documentElement.style.setProperty('--hero-font', typography.hero_font_family);
        } else {
            document.documentElement.style.setProperty('--hero-font', typography.font_family);
        }

        if (contentData.config.theme && contentData.config.theme['--accent']) {
            document.documentElement.style.setProperty('--accent', contentData.config.theme['--accent']);
        }

    }, []);

    useEffect(() => {
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


    useRevealObserver();

    return (
        <Router basename="/TestWeb3d">
            <ScrollToTop />
            <Routes>
                <Route path="/" element={
                    <Home
                        theme={theme}
                        toggleTheme={toggleTheme}
                        activeModalId={activeModalId}
                        setActiveModalId={setActiveModalId}
                        activeSection={activeSection}
                    />
                } />
                <Route path="/showcase" element={<ShowcasePage theme={theme} toggleTheme={toggleTheme} />} />
            </Routes>
        </Router>
    );
}

export default App;
