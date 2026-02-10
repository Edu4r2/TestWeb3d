import React from 'react';

export default function Footer({ text }) {
    return (
        <footer className="integrated-footer">
            <p id="footer-text">{text}</p>
        </footer>
    );
}
