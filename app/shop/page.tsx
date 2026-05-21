'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShoppingCart, Star, Search, Filter, X, SlidersHorizontal, Plus, MessageCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  ratings: number;
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = [
    'All',
    'Refrigeration',
    'Kitchen Appliances',
    'Cooking Appliances',
    'Laundry Appliances',
    'Small Home Appliances',
    'Electronics',
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      params.append('sort', sortBy);
      params.append('page', page.toString());
      params.append('limit', '12');
      if (priceRange.min > 0) {
        params.append('minPrice', priceRange.min.toString());
      }
      if (priceRange.max < 500000) {
        params.append('maxPrice', priceRange.max.toString());
      }
      if (featuredOnly) {
        params.append('featured', 'true');
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchProducts();
    })();
  }, [selectedCategory, searchTerm, sortBy, page, priceRange, featuredOnly]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('-createdAt');
    setPriceRange({ min: 0, max: 500000 });
    setFeaturedOnly(false);
    setPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold mb-2"
            >
              Shop Home Appliances
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-blue-100 text-xl"
            >
              Browse our premium collection of quality home appliances
            </motion.p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pr-10"
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-gray-900">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setPage(1);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all ${selectedCategory === category
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-gray-900">Price Range</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Min Price</label>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-600">KES {priceRange.min.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Max Price</label>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-600">KES {priceRange.max.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Featured Filter */}
                <div className="mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featuredOnly}
                      onChange={(e) => setFeaturedOnly(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="ml-3 text-gray-700">Featured Products Only</span>
                  </label>
                </div>

                {/* Sort */}
                <div>
                  <label htmlFor="sort-select" className="font-semibold mb-3 block text-gray-900">
                    Sort By
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="-createdAt">Newest First</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="-ratings">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="w-full"
                  variant="outline"
                >
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>

              {/* Mobile Filters */}
              <AnimatePresence>
                {mobileFiltersOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="lg:hidden mb-6 overflow-hidden"
                  >
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button onClick={() => setMobileFiltersOpen(false)}>
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      {/* Mobile filter content - simplified version */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Categories</h3>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                              <button
                                key={category}
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setPage(1);
                                }}
                                className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700'
                                  }`}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Sort</h3>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="-createdAt">Newest</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                            <option value="-ratings">Highest Rated</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="h-48 bg-gray-200 animate-pulse"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div className="bg-white rounded-elegant-lg shadow-elegant overflow-hidden card-hover group">
                          <div className="relative h-64 bg-gradient-to-br from-pink-100 to-rose-100 group-hover:from-pink-200 group-hover:to-rose-200 transition-colors">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover"
                            />
                            {product.featured && (
                              <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
                                Featured
                              </div>
                            )}
                            {product.stock === 0 && (
                              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 text-xs rounded-full font-medium shadow-md">
                                Out of Stock
                              </div>
                            )}
                            {/* Quick Actions Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <button
                                onClick={() => window.open(`https://wa.me/254780558800?text=${encodeURIComponent(`Hello, I'm interested in: ${product.name} (KES ${product.price.toLocaleString()})`)}`, '_blank')}
                                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors transform hover:scale-110 shadow-lg"
                                aria-label="Order via WhatsApp"
                              >
                                <MessageCircle className="w-5 h-5" />
                              </button>
                              <Link
                                href={`/product/${product._id}`}
                                className="bg-white text-pink-600 p-3 rounded-full hover:bg-pink-50 transition-colors transform hover:scale-110 shadow-lg"
                                aria-label="Quick view"
                              >
                                <Eye className="w-5 h-5" />
                              </Link>
                            </div>
                          </div>
                          <div className="p-5">
                            <Link href={`/product/${product._id}`}>
                              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2 text-lg">
                                {product.name}
                              </h3>
                            </Link>
                            <div className="flex items-center mb-3">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">{product.ratings}</span>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-2xl font-bold text-pink-600">
                                KES {product.price.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500 bg-pink-50 px-2 py-1 rounded-full">{product.category}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={async () => {
                                  try {
                                    const response = await fetch('/api/cart', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ productId: product._id, quantity: 1 }),
                                    });
                                    if (response.ok) {
                                      toast.success('Added to cart!');
                                    } else {
                                      toast.error('Failed to add to cart');
                                    }
                                  } catch {
                                    toast.error('Failed to add to cart');
                                  }
                                }}
                                disabled={product.stock === 0}
                                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2.5 rounded-full font-semibold hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add to Cart
                              </button>
                              <button
                                onClick={() => window.open(`https://wa.me/254780558800?text=${encodeURIComponent(`Hello, I'm interested in: ${product.name} (KES ${product.price.toLocaleString()})`)}`, '_blank')}
                                disabled={product.stock === 0}
                                className="bg-green-500 text-white p-2.5 rounded-full hover:bg-green-600 transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Order via WhatsApp"
                              >
                                <MessageCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-12">
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'primary' : 'outline'}
                          onClick={() => setPage(pageNum)}
                          className={page === pageNum ? 'w-10 h-10' : ''}
                        >
                          {pageNum}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopPageContent />
    </Suspense>
  );
}
