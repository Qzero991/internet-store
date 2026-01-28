import React, { useEffect } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../../components/ProductList/ProductList';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Cart.css';


const Cart: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { cartItems, removeFromCart, updateQuantity, cartCount, cartTotal, isLoading } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleQuantityChange = (cartItemId: number, currentQty: number, delta: number) => {
         const newQty = currentQty + delta;
         if (newQty > 0) {
             updateQuantity(cartItemId, newQty);
         }
    };

    const shipping = 0; 
    const total = cartTotal + shipping;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    if (isLoading) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading cart...</div>;
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <main className="cart-items-section">
                    <h1 className="cart-title">Shopping Cart ({cartCount})</h1>
                    
                    {cartItems.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                            Your cart is empty
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.cart_item_id} className="cart-item">
                                <img 
                                    src={item.Product.image_url} 
                                    alt={item.Product.name} 
                                    className="cart-item-image"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Product';
                                    }}
                                />
                                <div className="cart-item-details">
                                    <h3 className="cart-item-name">{item.Product.name}</h3>
                                    <div className="cart-item-price">{formatPrice(item.Product.price)}</div>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button 
                                            className="qty-btn" 
                                            onClick={() => handleQuantityChange(item.cart_item_id, item.quantity, -1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="qty-display">{item.quantity}</span>
                                        <button 
                                            className="qty-btn" 
                                            onClick={() => handleQuantityChange(item.cart_item_id, item.quantity, 1)}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.cart_item_id)}>
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </main>

                <aside className="cart-summary-section">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <button className="checkout-btn">
                        Proceed to Purchase
                    </button>
                </aside>
            </div>

            <section className="recommendations-section">
                <h2 className="recommendations-title">Check out what else might interest you</h2>
                <ProductList />
            </section>
        </div>
    );
};

export default Cart;
