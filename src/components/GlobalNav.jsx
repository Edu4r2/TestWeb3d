import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActiveSection } from '../hooks/useActiveSection';

export default function GlobalNav({ config }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const activeSection = useActiveSection();
    const navigate = useNavigate();
    const location = useLocation();

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

    const handleNavigation = (href) => {
        if (href.startsWith('#')) {
            if (location.pathname === '/') {
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {

                navigate('/');
                setTimeout(() => {
                    const element = document.querySelector(href);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        } else {
            navigate(href);
            window.scrollTo(0, 0);
        }
        setMobileMenuOpen(false);
        document.body.classList.remove('no-scroll');
    };

    const isLinkActive = (item) => {
        const currentPath = location.pathname.replace(/\/$/, '') || '/';
        const itemPath = item.href.replace(/\/$/, '') || '/';

        if (item.href.startsWith('#')) {
            return currentPath === '/' && activeSection === item.href.substring(1);
        }

        if (item.href === '/showcase' && currentPath === '/' && activeSection === 'projects') {
            return true;
        }

        // Match exact path or handle case where location.pathname might include basename unexpectedly
        return currentPath === itemPath || currentPath === `/TestWeb3d${itemPath}`;
    };

    const { navbar } = config;

    return (
        <>
            <nav className={`global-nav ${scrolled || location.pathname !== '/' ? 'scrolled' : ''}`}>
                <div
                    onClick={() => handleNavigation('#hero')}
                    className="logo"
                    style={{ cursor: 'pointer' }}
                >
                    <img id="nav-logo-img" src={navbar.logo_img} alt="Logo" className="logo-img" />
                    <span id="nav-logo-text">{navbar.logo_text}</span>
                </div>

                <div className="nav-right">
                    <div id="desktop-menu" className="desktop-menu">
                        {navbar.items.map((item, index) => (
                            <span
                                key={index}
                                onClick={() => handleNavigation(item.href)}
                                className={isLinkActive(item) ? 'active' : ''}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.label}
                            </span>
                        ))}
                    </div>

                    {/* Theme toggle removed */}

                    <div id="nav-socials" className="nav-socials">
                        {navbar.socials.map((s, index) => (
                            <div
                                key={index}
                                onClick={() => window.open(s.url, '_blank')}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className={s.icon}></i>
                            </div>
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
                        <div
                            key={index}
                            onClick={() => handleNavigation(item.href)}
                            className={isLinkActive(item) ? 'active' : ''}
                            style={{ cursor: 'pointer' }}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
                <div id="mobile-socials" className="mobile-socials">
                    {navbar.socials.map((s, index) => (
                        <div
                            key={index}
                            onClick={() => window.open(s.url, '_blank')}
                            style={{ cursor: 'pointer' }}
                        >
                            <i className={s.icon}></i>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
