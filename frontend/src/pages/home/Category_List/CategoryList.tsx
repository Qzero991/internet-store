import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '../../../components/Categories/CategoryCard';
import '../../../components/Categories/CategoryCard.css';

interface Category {
  category_id: number;
  name: string;
  description?: string;
  image_url?: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/search?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return <div className="category-loading">Loading categories...</div>;
  }

  if (error) {
    return <div className="category-error">{error}</div>;
  }
  

  return (
    <section className="category-section" id="categories">
      <h2 className="category-title">Shop by Category</h2>
      <p className="category-subtitle">Everything you need for rock climbing in one place</p>
      <div className="category-grid">
        {categories.map((category, index) => (
          <CategoryCard 
            key={category.category_id} 
            category={category} 
            index={index} 
            onClick={handleCategoryClick} 
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryList;
