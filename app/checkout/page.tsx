'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { ShoppingCart, MapPin, Phone, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/context/AuthContext';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    location: '',
  });

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
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Generate WhatsApp message
      const productsList = cartItems
        .map((item) => `• ${item.product.name} x${item.quantity} - KES ${(item.product.price * item.quantity).toLocaleString()}`)
        .join('\n');

      const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const message = `Hello Ilosunot Jeiso Home Appliance,

I would like to place an order.

*Customer Details:*
Name: ${formData.name}
Phone: ${formData.phone}
Location: ${formData.location}

*Order Details:*
${productsList}

*Total: KES ${totalPrice.toLocaleString()}*

Please assist with delivery.`;

      const whatsappUrl = `https://wa.me/254780558800?text=${encodeURIComponent(message)}`;

      // Clear cart after successful order
      await fetch('/api/cart', { method: 'DELETE' });

      toast.success('Redirecting to WhatsApp...');

      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');

      // Redirect to home after a short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setProcessing(false);
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

  if (cartItems.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
              <p className="text-gray-600">Review your order and place it via WhatsApp</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Delivery Information */}
                  <Card className="shadow-elegant rounded-elegant-lg">
                    <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-elegant-lg">
                      <h2 className="text-xl font-bold flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Delivery Information
                      </h2>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="07XXXXXXXXX"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                      />
                      <Input
                        label="Delivery Location"
                        placeholder="Enter your delivery location (e.g., Nakuru, Kericho, Bomet)"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        required
                      />
                    </CardContent>
                  </Card>

                  {/* Order Items */}
                  <Card className="shadow-elegant rounded-elegant-lg">
                    <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-elegant-lg">
                      <h2 className="text-xl font-bold flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Order Items
                      </h2>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      {cartItems.map((item) => (
                        <div key={item.product._id} className="flex justify-between items-center p-4 bg-pink-50 rounded-xl">
                          <div>
                            <p className="font-semibold text-gray-900">{item.product.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-pink-600">
                            KES {(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Payment Notice */}
                  <Card className="shadow-elegant rounded-elegant-lg bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="bg-amber-100 p-3 rounded-full mr-4">
                          <Phone className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">Payment Before Delivery</h3>
                          <p className="text-sm text-gray-600">
                            We require payment before delivery. Our team will contact you via WhatsApp to confirm your order and arrange payment details.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Summary */}
                <div>
                  <Card className="sticky top-20 shadow-elegant-lg rounded-elegant-lg">
                    <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-elegant-lg">
                      <h2 className="text-xl font-bold">Order Summary</h2>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">
                          KES {totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-semibold text-green-600">FREE</span>
                      </div>
                      <div className="border-t border-pink-200 pt-3">
                        <div className="flex justify-between">
                          <span className="font-bold text-xl">Total</span>
                          <span className="font-bold text-2xl text-pink-600">
                            KES {totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg py-4 rounded-full shadow-lg transform hover:scale-105 transition-all"
                        size="lg"
                        disabled={processing}
                      >
                        {processing ? (
                          'Processing...'
                        ) : (
                          <>
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Order via WhatsApp
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-gray-500 text-center mt-4">
                        By placing this order, you agree to our terms and conditions
                      </p>
                      <div className="bg-pink-50 p-4 rounded-xl mt-4">
                        <p className="text-sm text-gray-600 text-center">
                          <span className="font-semibold text-pink-600">Fast Delivery:</span> 24-48 Hours to Nakuru, Kericho & Bomet
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
