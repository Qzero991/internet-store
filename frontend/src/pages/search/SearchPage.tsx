import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard, { type Product } from '../../components/Products/ProductCard';
import { useCart } from '../../context/CartContext';
import './SearchPage.css';

interface Category {
    category_id: number;
    name: string;
}

const SearchPage: React.FC = () => {
    // URL Params
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category') || '';

    // Data State
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cart
    const { addToCart } = useCart();

    // Filter State
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        categoryParam ? [categoryParam] : []
    );
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [searchQuery, setSearchQuery] = useState(queryParam);


    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetch
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/categories')
                ]);

                if (!productsRes.ok || !categoriesRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();

                setAllProducts(productsData);
                setCategories(categoriesData);

                // Update selected category if coming from URL fresh
                if (categoryParam) {
                    // Normalize checking: Find exact name match or case-insensitive?
                    // Let's assume exact match for now from the text content of cards
                    setSelectedCategories([categoryParam]);
                }

            } catch (err) {
                console.error('Error fetching search data:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Run once on mount

    // Update local state if URL params change (e.g. searching from header)
    useEffect(() => {
        setSearchQuery(queryParam);
        if (categoryParam) {
            setSelectedCategories(prev => prev.includes(categoryParam) ? prev : [...prev, categoryParam]);
        }
    }, [queryParam, categoryParam]);


    // Filter Logic
    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            // 1. Search Query
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  product.description.toLowerCase().includes(searchQuery.toLowerCase());

            // 2. Categories
            // Assuming we map category names to IDs or the product has category names attached.
            // Backend products usually have `category_id`. We need to match it with `categories` list.
            let matchesCategory = true;
            if (selectedCategories.length > 0) {
                const productCategory = categories.find(c => c.category_id === product.category_id);
                if (productCategory) {
                    matchesCategory = selectedCategories.includes(productCategory.name);
                } else {
                    matchesCategory = false; // No category? Don't show if categories selected
                }
            }

            // 3. Price
            const price = Number(product.price);
            const min = priceRange.min ? Number(priceRange.min) : 0;
            const max = priceRange.max ? Number(priceRange.max) : Infinity;
            const matchesPrice = price >= min && price <= max;

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [allProducts, searchQuery, selectedCategories, priceRange, categories]);

    // Handlers
    const handleCategoryChange = (categoryName: string) => {
        setSelectedCategories(prev => 
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPriceRange(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setPriceRange({ min: '', max: '' });
        setSearchQuery('');
        setSearchParams({});
    };

    const handleAddToCart = async (product: Product) => {
        await addToCart(product);
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
    if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'red' }}>{error}</div>;

    return (
        <div className="search-page">
            <aside className="filters-sidebar">
                <h2 className="filters-title">Filters</h2>

                <div className="filter-section">
                    <h3 className="filter-section-title">Categories</h3>
                    {categories.map(category => (
                        <label key={category.category_id} className="category-filter-item">
                            <input 
                                type="checkbox" 
                                checked={selectedCategories.includes(category.name)}
                                onChange={() => handleCategoryChange(category.name)}
                            />
                            <span>{category.name}</span>
                        </label>
                    ))}
                </div>

                <div className="filter-section">
                    <h3 className="filter-section-title">Price Range</h3>
                    <div className="price-inputs">
                        <input 
                            type="number" 
                            name="min"
                            placeholder="Min" 
                            className="price-input"
                            value={priceRange.min}
                            onChange={handlePriceChange}
                            min="0"
                        />
                        <span className="price-separator">-</span>
                        <input 
                            type="number" 
                            name="max"
                            placeholder="Max" 
                            className="price-input"
                            value={priceRange.max}
                            onChange={handlePriceChange}
                            min="0"
                        />
                    </div>
                </div>

                <button className="clear-filters-btn" onClick={clearFilters}>
                    Clear all filters
                </button>
            </aside>

            <main className="search-results-container">
                <div className="search-header">
                    <h1 className="search-query-display">
                        {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
                    </h1>
                    <span className="results-count">
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                    </span>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="search-products-grid">
                        {filteredProducts.map(product => (
                            <ProductCard 
                                key={product.product_id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>No products match your filters.</p>
                        <button 
                            style={{ 
                                marginTop: '1rem', 
                                color: '#ff6b00', 
                                background: 'none', 
                                border: 'none', 
                                fontSize: '1rem',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                            onClick={clearFilters}
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchPage;
