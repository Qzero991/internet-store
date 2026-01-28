import React from 'react';
import './CategoryCard.css';

interface Category {
  category_id: number;
  name: string;
  description?: string;
  image_url?: string;
}

interface CategoryCardProps {
  category: Category;
  index: number;
  onClick: (categoryName: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index, onClick }) => {
  
  const getBackgroundStyle = (idx: number, imageUrl?: string) => {
    if (imageUrl) {
      return {
        backgroundImage: `url(${category.image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    
    
    const hues = [30, 210, 150, 45, 280];
    const hue = hues[idx % hues.length];
    return {
      background: `linear-gradient(45deg, hsl(${hue}, 60%, 30%), hsl(${hue}, 60%, 20%))`
    };
  };

  return (
    <div
      className="category-card"
      style={getBackgroundStyle(index, category.image_url)}
      onClick={() => onClick(category.name)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
              onClick(category.name);
          }
      }}
    >
      <div className="category-content">
        <h3 className="category-name">{category.name}</h3>
        {category.description && (
          <p className="category-description">{category.description}</p>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
