import { useEffect } from 'react';

export const useRevealObserver = () => {
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
    });
};
