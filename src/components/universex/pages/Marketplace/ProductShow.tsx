import React from 'react';
import { Globe, Server, Terminal, Star, Download, ExternalLink } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { Product } from './api';
import { useNavigate } from 'react-router-dom';

interface ProductShowProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductShow: React.FC<ProductShowProps> = ({ product }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <Server className="w-6 h-6" />;
      case 'website':
        return <Globe className="w-6 h-6" />;
      case 'service':
        return <Terminal className="w-6 h-6" />;
      default:
        return <Globe className="w-6 h-6" />;
    }
  };

  const handleClick = () => {
    navigate(`/universe/m/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group relative p-6 rounded-xl border cursor-pointer
        transition-all duration-300 transform hover:scale-[1.02]
        ${isDark
          ? 'bg-white/5 border-white/10 hover:bg-white/10'
          : 'bg-white border-gray-200 hover:shadow-xl'
        }
      `}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl bg-${
          product.type === 'api' ? 'blue' :
          product.type === 'website' ? 'purple' :
          'green'
        }-500/10`}>
          {getTypeIcon(product.type)}
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {product.category}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              product.visibility === 'public'
                ? isDark
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-green-100 text-green-800'
                : isDark
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {product.visibility}
            </span>
          </div>
        </div>
      </div>

      <p className={`mb-4 line-clamp-2 ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {product.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {product.tags?.map((tag, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded-full text-xs ${
              isDark
                ? 'bg-white/10 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Download className={`w-4 h-4 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <span className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {Math.floor(Math.random() * 1000)} downloads
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className={`text-sm font-medium ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {(4 + Math.random()).toFixed(1)}
            </span>
          </div>
          <div className={`text-lg font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            ${product.price}
          </div>
          <ExternalLink className={`w-4 h-4 ${
            isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'
          } transition-colors`} />
        </div>
      </div>
    </div>
  );
};

export default ProductShow;
