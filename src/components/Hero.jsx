import React from 'react';

export default function Hero({ data }) {
    return (
        <section id="hero">
            <video id="hero-video" className="video-bg" autoPlay muted loop playsInline poster={data.video_poster} key={data.video_src}>
                <source src={data.video_src} type="video/mp4" />
            </video>
            <div className="video-overlay"></div>

            <div className="hero-content reveal-up">
                <h1 id="hero-title" dangerouslySetInnerHTML={{ __html: data.title }}></h1>
                <p id="hero-desc">{data.description}</p>
                <a id="hero-btn" href={data.button_link} className="btn-glass">{data.button_text}</a>
            </div>
        </section>
    );
}
