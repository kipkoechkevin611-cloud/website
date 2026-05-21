'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/context/AuthContext';
import { motion } from 'framer-motion';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cartItems || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    (async () => {
      await fetchCart();
    })();
  }, [user]);

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cartItems);
      } else {
        toast.error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cartItems);
        toast.success('Item removed from cart');
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
              <p className="text-gray-600">Review your items before checkout</p>
            </div>

            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="shadow-elegant rounded-elegant-lg">
                  <CardContent className="p-16 text-center">
                    <ShoppingBag className="w-24 h-24 mx-auto text-pink-300 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Add some beautiful home appliances to get started!</p>
                    <Button
                      onClick={() => router.push('/shop')}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 rounded-full"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Continue Shopping
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="shadow-elegant rounded-elegant-lg hover:shadow-elegant-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <ShoppingCart className="w-12 h-12 text-pink-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                                {item.product.name}
                              </h3>
                              <p className="text-pink-600 font-bold text-xl mb-3">
                                KES {item.product.price.toLocaleString()}
                              </p>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.product._id, item.quantity - 1)
                                  }
                                  className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors flex items-center justify-center"
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product._id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors flex items-center justify-center"
                                  disabled={item.quantity >= item.product.stock}
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-2xl text-pink-600 mb-3">
                                KES {(item.product.price * item.quantity).toLocaleString()}
                              </p>
                              <button
                                onClick={() => removeItem(item.product._id)}
                                className="text-red-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                                aria-label="Remove item from cart"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Card className="sticky top-20 shadow-elegant-lg rounded-elegant-lg">
                      <CardContent className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-semibold text-gray-900">
                              KES {totalPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className="font-semibold text-green-600">FREE</span>
                          </div>
                          <div className="border-t border-pink-200 pt-4">
                            <div className="flex justify-between">
                              <span className="font-bold text-xl text-gray-900">Total</span>
                              <span className="font-bold text-2xl text-pink-600">
                                KES {totalPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* WhatsApp Quick Order */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-4 border-2 border-green-200">
                          <p className="text-sm text-gray-700 text-center mb-3">
                            <span className="font-semibold text-green-700">Quick Order:</span> Complete checkout via WhatsApp
                          </p>
                          <Button
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-full shadow-lg transform hover:scale-105 transition-all"
                            onClick={() => router.push('/checkout')}
                          >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Checkout via WhatsApp
                          </Button>
                        </div>

                        <Button
                          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-full shadow-lg transform hover:scale-105 transition-all"
                          onClick={() => router.push('/checkout')}
                        >
                          Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full mt-3 border-pink-300 text-pink-600 hover:bg-pink-50 rounded-full"
                          onClick={() => router.push('/shop')}
                        >
                          Continue Shopping
                        </Button>

                        <div className="mt-6 p-4 bg-pink-50 rounded-xl">
                          <p className="text-sm text-gray-600 text-center">
                            <span className="font-semibold text-pink-600">Fast Delivery:</span> 24-48 Hours to Nakuru, Kericho & Bomet
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
