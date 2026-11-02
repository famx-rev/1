import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, Loader, AlertCircle,
  Server, Globe, Terminal
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ProductCreate } from './ProductCreate';
import { ProductShow } from './ProductShow';
import { Product } from './api';
import { productShowApi } from './apishow';

export const UniverseMarketplace = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showYours, setShowYours] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [showYours]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = showYours 
        ? await productShowApi.getUserProducts()
        : await productShowApi.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchProducts();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.tags ?? []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header with Gradient Background */}
      <div className={`
        relative p-6 rounded-2xl overflow-hidden
        ${isDark
          ? 'bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10'
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
        }
      `}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        </div>

        <div className="relative flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-12 pr-4 py-3 rounded-xl text-lg
                  transition-all duration-300
                  ${isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                    : 'bg-white text-gray-900 placeholder-gray-500 shadow-lg'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50
                `}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowYours(!showYours)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                transition-all duration-300
                ${isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-900 shadow-lg'
                }
              `}
            >
              {showYours ? 'Show All' : 'Your Products'}
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                transition-all duration-300 transform hover:scale-105
                ${isDark
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                }
                shadow-lg hover:shadow-xl
              `}
            >
              <Plus className="w-5 h-5" />
              New Product
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProducts.map((product) => (
            <ProductShow
              key={product.id}
              product={product}
              onSelect={(product) => console.log('Selected product:', product)}
            />
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                No products found
              </p>
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <ProductCreate 
          onBack={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};