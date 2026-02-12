import { useState, useEffect } from 'react';

export const useActiveSection = () => {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, {
            root: null,
            rootMargin: '-40% 0px -40% 0px', // More permissive: detects when section enters central 20%
            threshold: 0
        });

        const observeSections = () => {
            const sections = document.querySelectorAll('section[id]');
            sections.forEach(section => {
                observer.observe(section);
            });
        };
        observeSections();
        const timeoutId = setTimeout(observeSections, 500);

        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, []);

    return activeSection;
};
