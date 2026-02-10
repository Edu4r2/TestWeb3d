import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function ModalManager({ activeModalId, onClose, categories }) {
    const [activeTab, setActiveTab] = useState(null);
    const [isVisible, setIsVisible] = useState(false); // Controls animation state

    const category = categories.find(c => c.id === activeModalId);

    // Reset tab when modal opens
    useEffect(() => {
        if (category && category.tabs && category.tabs.length > 0) {
            setActiveTab(category.tabs[0].id);
        }
    }, [activeModalId, category]);

    // Handle Animation Entry & Scroll Lock
    useEffect(() => {
        if (activeModalId) {
            // Lock body scroll
            document.body.style.overflow = 'hidden';

            // Slight delay to allow DOM paint before adding 'active' class for transition
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
        } else {
            // Unlock body scroll
            document.body.style.overflow = '';
            setIsVisible(false);
        }

        // Cleanup function to ensure scroll is unlocked if component unmounts
        return () => {
            document.body.style.overflow = '';
        };
    }, [activeModalId]);

    if (!category || !activeModalId) return null;

    const tabs = category.tabs || [];
    const currentTabId = activeTab || (tabs.length > 0 ? tabs[0].id : null);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const modalContent = (
        <div className={`modal-overlay ${isVisible ? 'active' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
                <div className="modal-banner" style={{ backgroundImage: `url('${category.banner}')` }}>
                    <div className="modal-banner-overlay"></div>
                    <h2 className="section-title">{category.title}</h2>
                </div>

                <div className="modal-tabs">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${currentTabId === tab.id ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {tabs.map((tab) => (
                    <div key={tab.id} id={`${category.id}-${tab.id}`} className={`gallery-grid ${currentTabId === tab.id ? 'active' : ''}`}>
                        {tab.items.length > 0
                            ? tab.items.map((item, i) => (
                                <a key={i} href={item.link} target="_blank" className="gallery-item">
                                    <div className="gallery-img-wrapper">
                                        <img src={item.src} loading="lazy" alt={item.title || "Asset"} />
                                        {item.price && (
                                            <div className="item-price-tag">{item.price}</div>
                                        )}
                                    </div>
                                    <div className="gallery-item-title">
                                        {item.title}
                                        {item.link && item.link.includes('cgtrader') && (
                                            <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginLeft: '8px', fontSize: '0.8em', opacity: 0.7 }}></i>
                                        )}
                                    </div>
                                </a>
                            ))
                            : <p style={{ color: 'var(--text-muted)', textAlign: 'center', width: '100%' }}>Próximamente...</p>
                        }
                    </div>
                ))}
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
}
