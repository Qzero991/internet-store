import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsMobileSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-left">
        <Link to="/" className="logo-link">
          ClimbGear
        </Link>
      </div>

      <div className={`header-center ${isMobileSearchOpen ? 'mobile-open' : ''}`}>
        <button 
          className="mobile-search-trigger"
          onClick={() => setIsMobileSearchOpen(true)}
          aria-label="Open search"
        >
          <Search size={24} />
        </button>

        <form onSubmit={handleSearch} className="search-bar">
          <Search className="search-icon" size={20} color="#666" />
          <input
            type="text"
            placeholder="Search for equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="button" 
            className="mobile-search-close"
            onClick={() => setIsMobileSearchOpen(false)}
          >
            <X size={20} color="#666" />
          </button>
        </form>
      </div>

      <div className={`header-right ${isMobileSearchOpen ? 'hidden' : ''}`}>
        <Link to="/cart" className="icon-button" aria-label="Cart">
           <div style={{ position: 'relative' }}>
             <ShoppingCart size={24} />
             {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
           </div>
        </Link>
        <Link to={isAuthenticated ? "/profile" : "/login"} className="icon-button" aria-label="Profile">
          <User size={24} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
