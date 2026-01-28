import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
    cart_item_id: number;
    product_id: number;
    quantity: number;
    Product: {
        product_id: number;
        name: string;
        price: number;
        image_url: string;
    }
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: any) => Promise<void>;
    removeFromCart: (cartItemId: number) => Promise<void>;
    updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
    cartCount: number;
    cartTotal: number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { token, isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCart = async () => {
        if (!token) {
            setCartItems([]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('/api/cartItems', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
            } else {
                console.error('Failed to fetch cart');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch cart on mount or when auth changes
    useEffect(() => {
        fetchCart();
    }, [token]);

    const addToCart = async (product: any) => {
        if (!isAuthenticated || !token) {
            alert("Please log in to add items to the cart");
            return;
        }

        try {
            // Optimistic update or simple fetch?
            // Let's do fetch for consistency with backend logic (checking existence etc)
            
            // Note: Backend might update existing item or create new one.
            const response = await fetch('/api/cartItems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id: product.product_id,
                    quantity: 1
                })
            });

            if (response.ok) {
                // Refresh cart to show updated state and IDs
                fetchCart();
            } else {
                console.error('Failed to add to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async (cartItemId: number) => {
        if (!token) return;

        try {
            const response = await fetch(`/api/cartItems/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setCartItems(prev => prev.filter(item => item.cart_item_id !== cartItemId));
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    const updateQuantity = async (cartItemId: number, quantity: number) => {
        if (!token) return;

        try {
            const response = await fetch(`/api/cartItems/${cartItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            });

            if (response.ok) {
                // Update local state
                setCartItems(prev => prev.map(item => 
                    item.cart_item_id === cartItemId 
                        ? { ...item, quantity } 
                        : item
                ));
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.Product.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            cartCount,
            cartTotal,
            isLoading
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
