import React, { useState, useEffect } from 'react';
import { Star, User as UserIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Reviews.css';

interface Review {
    review_id: number;
    user_id: number;
    rating: number;
    comment: string;
    timestamp: string;
    User?: {
        first_name: string;
        last_name: string;
    }
}

interface ProductReviewsProps {
    productId: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
    const navigate = useNavigate();
    const { isAuthenticated, token, user } = useAuth(); // Assuming 'user' is exposed in context
    
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Reviews
    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews/product/${productId}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId: number) => {
        if (!token) return;
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            const response = await fetch(`/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                await fetchReviews();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete review');
            }
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id: productId,
                    rating,
                    comment
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit review');
            }

            // Reset form and reload list
            setComment('');
            setRating(5);
            await fetchReviews();
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div className="reviews-section">
            <h2 className="section-title">Reviews</h2>

            {/* Form */}
            <div className="review-form-container">
                {!isAuthenticated ? (
                    <div className="login-prompt">
                        Please <span className="link-text" onClick={() => navigate('/login')}>log in</span> to write a review.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="review-form">
                        <h3>Write a Review</h3>
                        {error && <div className="error-message">{error}</div>}
                        
                        <div className="star-rating-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star}
                                    size={24}
                                    className={star <= rating ? 'star-filled' : 'star-empty'}
                                    onClick={() => setRating(star)}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </div>

                        <textarea 
                            className="review-textarea"
                            placeholder="Share your thoughts about this product..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />

                        <button 
                            type="submit" 
                            className="submit-review-btn" 
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Post Review'}
                        </button>
                    </form>
                )}
            </div>

            {/* List */}
            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to write one!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.review_id} className="review-card">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <div className="avatar-placeholder">
                                        {review.User?.first_name?.[0] || <UserIcon size={16} />}
                                    </div>
                                    <span className="reviewer-name">
                                        {review.User && review.User.first_name 
                                            ? `${review.User.first_name} ${review.User.last_name || ''}`
                                            : 'Anonymous'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span className="review-date">
                                        {new Date(review.timestamp).toLocaleDateString()}
                                    </span>
                                    {isAuthenticated && user && (Number(user.user_id) === review.user_id || user.role === 'admin') && (
                                        <button 
                                            onClick={() => handleDelete(review.review_id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                            title="Delete Review"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={16} 
                                        className={i < review.rating ? "star-filled" : "star-empty"} 
                                    />
                                ))}
                            </div>
                            
                            <p className="review-text">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
