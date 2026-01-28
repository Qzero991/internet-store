import React from 'react';
import './Hero.css';
import heroImage from '../../../assets/climbin_man.png';

const Hero: React.FC = () => {
    
    const handleScrollToProducts = () => {
        
        const categoriesSection = document.getElementById('categories');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="hero-content">
                <h1 className="hero-motto">
                    Reach New<br />
                    Heights
                </h1>
                <button 
                    className="hero-cta-button"
                    onClick={handleScrollToProducts}
                >
                    Check our products
                </button>
            </div>
        </section>
    );
};

export default Hero;
