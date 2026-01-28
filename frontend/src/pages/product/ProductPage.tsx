import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductReviews from '../../components/Reviews/ProductReviews';
import './ProductPage.css';

interface Product {
    product_id: number;
    name: string;
    description: string;
    price: string | number;
    image_url: string;
    stock_quantity: number;
    category_id?: number;
}

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const response = await fetch(`/api/products/${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Product not found');
                    }
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err: any) {
                console.error('Error fetching product:', err);
                setError(err.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;
        
        setAdding(true);
        // We'll call addToCart multiple times or once with qty if supported.
        // Current CartContext implementation:
        // addToCart(product) -> adds 1. 
        // Wait, looking at context implementation:
        // body: JSON.stringify({ product_id: product.product_id, quantity: 1 })
        // It seems strictly adds 1. 
        // Ideally I should update CartContext to accept quantity.
        // But for now let's just loop or modify context.
        
        // Actually, let's just invoke it once for now, or loop. 
        // A better approach is to modify CartContext later to support quantity.
        // For this step I will just add 1 item or loop.
        // Or I can just call it `quantity` times.
        try {
            // Ideally: await addToCart(product, quantity);
            // Current signature: addToCart(product: any) => Promise<void>
            // And inside: quantity: 1
            
            // I will update the Context signature in a bit if I can.
            // For now, let's just add one item and maybe I'll quick-fix the context to accept quantity if it's easy.
            
            // Let's assume standard add for now to not break everything immediately.
            // Or better: let's invoke it in a loop if I must, but that's bad.
            // I'll check CartContext again.
             
            await addToCart(product); 
            // TODO: Support custom quantity adding
            
        } catch (err) {
            console.error(err);
        } finally {
            setAdding(false);
        }
    };

    const formatPrice = (price: string | number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Number(price));
    };

    if (loading) {
        return (
            <div className="product-page-container">
                <div className="loading-container">Loading product details...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-page-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} /> Back
                </button>
                <div className="error-container">
                    <AlertCircle size={48} style={{ marginBottom: '1rem' }} />
                    <h2>{error || 'Product not found'}</h2>
                    <button 
                        className="add-cart-large-btn" 
                        style={{ marginTop: '2rem', maxWidth: '200px', marginInline: 'auto' }}
                        onClick={() => navigate('/')}
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-page-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} /> Back to results
            </button>

            <div className="product-details-grid">
                <div className="product-image-section">
                    <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="product-detail-image"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
                        }}
                    />
                </div>

                <div className="product-info-section">
                    <h1 className="product-title">{product.name}</h1>
                    <div className="product-price">{formatPrice(product.price)}</div>

                    <div className={`stock-status ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock_quantity > 0 ? (
                            <>
                                <Check size={20} />
                                <span>In Stock ({product.stock_quantity} available)</span>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={20} />
                                <span>Out of Stock</span>
                            </>
                        )}
                    </div>

                    <div className="product-description-container">
                        <div className="description-label">Description</div>
                        <p className="product-description-text">{product.description}</p>
                    </div>

                    <div className="add-to-cart-section">
                        {/* 
                        <div className="quantity-selector">
                            <span className="quantity-label">Quantity:</span>
                            <input 
                                type="number" 
                                min="1" 
                                max={product.stock_quantity} 
                                value={quantity} 
                                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1)))}
                                className="qty-input"
                                disabled={product.stock_quantity === 0}
                            />
                        </div> 
                        */}

                        <button 
                            className="add-cart-large-btn"
                            onClick={handleAddToCart}
                            disabled={product.stock_quantity === 0 || adding}
                        >
                            <ShoppingCart size={24} />
                            {adding ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Component */}
            <ProductReviews productId={product.product_id} />
        </div>
    );
};

export default ProductPage;
