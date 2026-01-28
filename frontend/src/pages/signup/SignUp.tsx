import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirmPassword: '',
        general: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateForm = () => {
        const newErrors = { 
            first_name: '', 
            last_name: '', 
            email: '', 
            phone_number: '', 
            password: '', 
            confirmPassword: '', 
            general: '' 
        };
        let isValid = true;

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
            isValid = false;
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors(prev => ({ ...prev, general: '' }));

        try {
            
            const {...apiData } = formData;
            
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.details?.[0] || 'Registration failed');
            }

            console.log('Registration successful:', data);
            
            
            navigate('/login');
            
        } catch (error) {
            console.error('Registration error:', error);
            setErrors(prev => ({
                ...prev,
                general: error instanceof Error ? error.message : 'An unexpected error occurred'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h1 className="signup-title">Create Account</h1>
                
                <form className="signup-form" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="api-error">
                            {errors.general}
                        </div>
                    )}

                    <div className="signup-form-row">
                        <div className="form-group">
                            <label htmlFor="first_name" className="form-label">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                className={`form-input ${errors.first_name ? 'error' : ''}`}
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="John"
                                disabled={isLoading}
                            />
                            {errors.first_name && <span className="error-message">{errors.first_name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name" className="form-label">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                className={`form-input ${errors.last_name ? 'error' : ''}`}
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Doe"
                                disabled={isLoading}
                            />
                            {errors.last_name && <span className="error-message">{errors.last_name}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            disabled={isLoading}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone_number" className="form-label">Phone Number (Optional)</label>
                        <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            className={`form-input ${errors.phone_number ? 'error' : ''}`}
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            disabled={isLoading}
                        />
                         {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`form-input ${errors.password ? 'error' : ''}`}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min. 6 characters"
                            disabled={isLoading}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter password"
                            disabled={isLoading}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    <button type="submit" className="signup-button" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: '#ff6b00', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
