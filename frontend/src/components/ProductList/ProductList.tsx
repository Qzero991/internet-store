import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard, { type Product } from '../Products/ProductCard';
import { useCart } from '../../context/CartContext';
import './ProductList.css';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async (product: Product) => {
        await addToCart(product);
    };

    if (loading) return <div className="product-list-loading">Loading products...</div>;
    if (error) return <div className="product-list-error">{error}</div>;

    return (
        <section className="product-section">
            <div className="product-list-header">
                <div className="product-list-titles">
                    <h2 className="product-list-main-title">Our popular products</h2>
                    <p className="product-list-sub-title">Our customer's choice</p>
                </div>
                <button 
                    className="all-products-btn"
                    onClick={() => navigate('/search')}
                >
                    All products
                </button>
            </div>
            
            <div className="product-list">
                {Array.isArray(products) && products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard 
                            key={product.product_id} 
                            product={product} 
                            onAddToCart={handleAddToCart} 
                        />
                    ))
                ) : (
                    <div style={{gridColumn: '1 / -1', textAlign: 'center'}}>No products found.</div>
                )}
            </div>
        </section>
    );
};

export default ProductList;
