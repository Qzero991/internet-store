import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ClimbGear</h3>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            Your ultimate destination for professional climbing equipment. 
            Reach new heights with our premium gear.
          </p>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-list">
            <li className="contact-item">
              <MapPin size={18} color="#ff6600" />
              <span>123 Summit Avenue, Peak City, PC 94043</span>
            </li>
            <li className="contact-item">
              <Phone size={18} color="#ff6600" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="contact-item">
              <Mail size={18} color="#ff6600" />
              <span>support@climbgear.com</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ClimbGear. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
