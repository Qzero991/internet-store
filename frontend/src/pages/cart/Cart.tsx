import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import ProductList from '../../components/ProductList/ProductList';
import './Cart.css';

// Mock Cart Item Interface
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
}

const Cart: React.FC = () => {
    // Mock Data - In a real app this would come from Context/Redux/API
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: "Premium Rock Climbing Shoes",
            price: 129.99,
            quantity: 1,
            image_url: "/pictures/clothes.png" // Using path that might exist based on category data
        },
        {
            id: 2,
            name: "Pro Chalk Bag",
            price: 24.50,
            quantity: 2,
            image_url: "/pictures/accessories.png"
        }
    ]);

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(items => items.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping for now
    const total = subtotal + shipping;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <main className="cart-items-section">
                    <h1 className="cart-title">Shopping Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h1>
                    
                    {cartItems.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                            Your cart is empty
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img 
                                    src={item.image_url} 
                                    alt={item.name} 
                                    className="cart-item-image"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Product';
                                    }}
                                />
                                <div className="cart-item-details">
                                    <h3 className="cart-item-name">{item.name}</h3>
                                    <div className="cart-item-price">{formatPrice(item.price)}</div>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>
                                            <Minus size={16} />
                                        </button>
                                        <span className="qty-display">{item.quantity}</span>
                                        <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
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
                        <span>{formatPrice(subtotal)}</span>
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
                {/* Reusing ProductList but hiding its default header by CSS if needed, 
                    or the component logic is self-contained. 
                    Note: ProductList has its own header "Our popular products". 
                    We might want to hide that via CSS within this page context if it conflicts.
                */}
                <ProductList />
            </section>
        </div>
    );
};

export default Cart;
