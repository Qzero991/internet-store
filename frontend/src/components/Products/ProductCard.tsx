import React from 'react';
import { ShoppingCart } from 'lucide-react';
import './ProductCard.css';

export interface Product {
    product_id: number;
    name: string;
    description: string;
    price: string | number;
    image_url: string;
    stock_quantity: number;
    category_id?: number;
}

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(product.price));

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="product-image"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=No+Image';
                    }}
                />
                <button 
                    className="add-to-cart-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                    }}
                >
                    <ShoppingCart size={18} />
                    Add to Cart
                </button>
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">{formattedPrice}</div>
            </div>
        </div>
    );
};

export default ProductCard;
