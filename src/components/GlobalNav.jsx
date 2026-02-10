import React, { useState, useEffect } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';

export default function GlobalNav({ config, toggleTheme }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const activeSection = useActiveSection();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > window.innerHeight * 0.8);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        const isOpen = !mobileMenuOpen;
        setMobileMenuOpen(isOpen);
        document.body.classList.toggle('no-scroll', isOpen);
    };

    const { navbar } = config;

    return (
        <>
            <nav className={`global-nav ${scrolled ? 'scrolled' : ''}`}>
                <a href="#" className="logo">
                    <img id="nav-logo-img" src={navbar.logo_img} alt="Logo" className="logo-img" />
                    <span id="nav-logo-text">{navbar.logo_text}</span>
                </a>

                <div className="nav-right">
                    <div id="desktop-menu" className="desktop-menu">
                        {navbar.items.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className={activeSection === item.href.substring(1) ? 'active' : ''}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <button id="theme-toggle" className="theme-btn" aria-label="Cambiar Tema" onClick={toggleTheme}>
                        <i className="fa-solid fa-sun sun-icon"></i>
                        <i className="fa-solid fa-moon moon-icon"></i>
                    </button>

                    <div id="nav-socials" className="nav-socials">
                        {navbar.socials.map((s, index) => (
                            <a key={index} href={s.url} target="_blank"><i className={s.icon}></i></a>
                        ))}
                    </div>
                </div>

                <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>

            <div id="mobileMenu" className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                <div id="mobile-links" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {navbar.items.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            onClick={toggleMenu}
                            className={activeSection === item.href.substring(1) ? 'active' : ''}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
                <div id="mobile-socials" className="mobile-socials">
                    {navbar.socials.map((s, index) => (
                        <a key={index} href={s.url} target="_blank"><i className={s.icon}></i></a>
                    ))}
                </div>
            </div>
        </>
    );
}
