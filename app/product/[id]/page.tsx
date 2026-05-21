'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ShoppingCart, Star, Heart, ArrowLeft, Plus, Minus, Truck, Shield, RefreshCw, MessageCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/context/AuthContext';
import { motion } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  featured: boolean;
  ratings: number;
  reviews: Array<{
    user: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);

        // Fetch related products
        if (data.category) {
          const relatedResponse = await fetch(`/api/products?category=${encodeURIComponent(data.category)}&limit=4`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedProducts(relatedData.products?.filter((p: Product) => p._id !== data._id).slice(0, 4) || []);
          }
        }
      } else {
        toast.error('Product not found');
        router.push('/shop');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      (async () => {
        await fetchProduct();
      })();
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?._id,
          quantity,
        }),
      });

      if (response.ok) {
        toast.success('Added to cart');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product?._id }),
      });

      if (response.ok) {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleWhatsAppOrder = () => {
    const message = `Hello, I would like to order: ${product?.name} (KES ${product?.price?.toLocaleString()}). Quantity: ${quantity}`;
    window.open(`https://wa.me/254780558800?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/shop" className="text-pink-600 hover:text-pink-700 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-elegant-lg shadow-elegant p-8"
          >
            <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 rounded-elegant flex items-center justify-center relative overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
              {product.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full font-medium shadow-md">
                  Featured
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-elegant-lg shadow-elegant p-8">
              <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.ratings)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">{product.ratings} / 5</span>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-elegant p-6 mb-6">
                <div className="flex items-baseline">
                  <span className="text-sm text-gray-600 mr-2">Price:</span>
                  <span className="text-4xl font-bold text-pink-600">
                    KES {product.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${product.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}>
                  {product.stock > 0 ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {product.stock} in stock
                    </>
                  ) : (
                    'Out of stock'
                  )}
                </span>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors flex items-center justify-center"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors flex items-center justify-center"
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-4 rounded-full"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-full"
                  onClick={handleWhatsAppOrder}
                  disabled={product.stock === 0}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Order via WhatsApp
                </Button>
              </div>

              {/* Delivery Info */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-elegant border-2 border-amber-200">
                <div className="flex items-start">
                  <Truck className="w-6 h-6 text-amber-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Fast Delivery</h3>
                    <p className="text-sm text-gray-600">
                      24-48 hour delivery to Nakuru, Kericho, and Bomet regions. Payment required before delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="bg-white rounded-elegant-lg shadow-elegant p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Why Choose This Product?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="bg-pink-100 p-3 rounded-full mr-4">
                  <Shield className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Quality Guaranteed</h3>
                  <p className="text-sm text-gray-600">Genuine products with warranty</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-pink-100 p-3 rounded-full mr-4">
                  <Truck className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Fast Delivery</h3>
                  <p className="text-sm text-gray-600">24-48 hour delivery</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-pink-100 p-3 rounded-full mr-4">
                  <RefreshCw className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Easy Returns</h3>
                  <p className="text-sm text-gray-600">Hassle-free return policy</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={`/product/${relatedProduct._id}`}
                    className="bg-white rounded-elegant-lg shadow-elegant overflow-hidden hover:shadow-elegant-lg transition-all group block card-hover"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-pink-100 to-rose-100 group-hover:from-pink-200 group-hover:to-rose-200 transition-colors">
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{relatedProduct.ratings}</span>
                      </div>
                      <div className="text-xl font-bold text-pink-600">
                        KES {relatedProduct.price.toLocaleString()}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
