import React, { useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';


export default function Products({ config, categories, onOpenModal }) {
    return (
        <section id="products" style={{
            backgroundImage: config.products_background ? `linear-gradient(var(--overlay-grad-mid), var(--overlay-grad-mid)), url('${config.products_background}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>

            {}

            <div className="content-wrapper">
                <h2 id="cat-title" className="section-title reveal-up">{config.titles.categories}</h2>
                <div id="categories-container" className="grid">
                    {categories.map((cat, index) => (
                        <div key={cat.id}>
                            <CategoryCard category={cat} index={index} onOpenModal={onOpenModal} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
