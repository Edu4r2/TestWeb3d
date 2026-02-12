import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TopProgressBar = () => {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Reset and start progress on route change or initial load
        setProgress(0);
        setVisible(true);

        const intervals = [
            setTimeout(() => setProgress(30), 100),
            setTimeout(() => setProgress(60), 400),
            setTimeout(() => setProgress(80), 800),
            setTimeout(() => setProgress(95), 1200),
            setTimeout(() => {
                setProgress(100);
                setTimeout(() => setVisible(false), 500); // Fade out after completion
            }, 1800)
        ];

        return () => {
            intervals.forEach(clearTimeout);
        };
    }, [location]);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            backgroundColor: 'transparent',
            zIndex: 9999,
            pointerEvents: 'none'
        }}>
            <div style={{
                height: '100%',
                backgroundColor: 'var(--accent)',
                width: `${progress}%`,
                transition: 'width 0.4s ease-out',
                boxShadow: '0 0 10px var(--accent)'
            }} />
        </div>
    );
};

export default TopProgressBar;
