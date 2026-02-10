import React, { useState } from 'react';

export default function ModalManager({ activeModalId, onClose, categories }) {
    const [activeTab, setActiveTab] = useState(null);

    const category = categories.find(c => c.id === activeModalId);

    if (!category) return null;

    // Reset tab when modal opens (handled by key or effect usually, but here uncomplicated)
    // Actually, we should set default tab.
    const tabs = category.tabs || [];
    const currentTabId = activeTab || (tabs.length > 0 ? tabs[0].id : null);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    // When modal changes, reset tab
    React.useEffect(() => {
        if (category && tabs.length > 0) setActiveTab(tabs[0].id);
    }, [activeModalId]);

    return (
        <div className={`modal-overlay ${activeModalId ? 'active' : ''}`} onClick={onClose}>
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
                                    <img src={item.src} loading="lazy" alt="Asset" />
                                </a>
                            ))
                            : <p style={{ color: 'var(--text-muted)', textAlign: 'center', width: '100%' }}>Próximamente...</p>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}
