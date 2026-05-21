'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Package, ShoppingCart, User, MapPin, Phone, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  user: { name: string; email: string };
  products: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalPrice: number;
  deliveryAddress: string;
  phone: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: 'Pending' | 'Collecting' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuth = async () => {
    // Disable auth check - allow direct access
    setIsAdmin(true);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (response.ok) {
        toast.success('Order status updated successfully');
        fetchOrders();
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

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

  if (!isAdmin) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Collecting':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Collecting':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders Management</h1>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
              <p className="text-gray-500">Orders will appear here when customers make purchases</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-500">Order #{order._id.slice(-8)}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {order.orderStatus === 'Pending' && (
                          <Button
                            onClick={() => updateOrderStatus(order._id, 'Collecting')}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Start Collecting
                          </Button>
                        )}
                        {order.orderStatus === 'Collecting' && (
                          <Button
                            onClick={() => updateOrderStatus(order._id, 'Delivered')}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Mark as Delivered
                          </Button>
                        )}
                        {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                          <Button
                            onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Customer Information
                        </h3>
                        <p className="text-sm text-gray-600">{order.user.name}</p>
                        <p className="text-sm text-gray-600">{order.user.email}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                          <Phone className="w-4 h-4" />
                          {order.phone}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Delivery Address
                        </h3>
                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Products
                      </h3>
                      <div className="space-y-2">
                        {order.products.map((product, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                            </div>
                            <p className="font-semibold">
                              KES {(product.price * product.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Payment Method: {order.paymentMethod}</p>
                        <p className="text-sm text-gray-500">Payment Status: {order.paymentStatus}</p>
                      </div>
                      <p className="text-2xl font-bold">
                        Total: KES {order.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
