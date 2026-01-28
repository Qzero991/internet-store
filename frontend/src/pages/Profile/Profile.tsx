import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return null;
    }

    const firstInitial = user.first_name 
        ? user.first_name.charAt(0).toUpperCase() 
        : user.email.charAt(0).toUpperCase();

    return (
        <div className="profile-page">
            <div className="profile-container">
                <header className="profile-header">
                    <div className="profile-avatar">
                        {firstInitial}
                    </div>
                    <div className="profile-info">
                        <h1>{user.first_name} {user.last_name}</h1>
                        <p className="profile-email">{user.email}</p>
                    </div>
                </header>

                <div className="profile-details-section">
                    <div className="detail-group">
                        <span className="detail-label">First Name</span>
                        <div className="detail-value">{user.first_name || 'N/A'}</div>
                    </div>
                    <div className="detail-group">
                        <span className="detail-label">Last Name</span>
                        <div className="detail-value">{user.last_name || 'N/A'}</div>
                    </div>
                    <div className="detail-group">
                        <span className="detail-label">Email Address</span>
                        <div className="detail-value">{user.email}</div>
                    </div>
                     <div className="detail-group">
                        <span className="detail-label">Phone Number</span>
                        <div className="detail-value">{String(user.phone_number || 'Not provided')}</div>
                    </div>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
