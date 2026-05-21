import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product, Order, User } from '@/lib/models';
import { verifyToken } from '@/lib/jwt';

async function verifyAdmin(request: Request) {
  const token = (request as NextRequest).cookies.get('adminToken')?.value;
  if (!token) return false;
  const decoded = verifyToken(token);
  if (!decoded) return false;
  // Accept access if isAdmin === true OR role === "admin"
  const isAdmin = decoded.isAdmin === true;
  const hasAdminRole = decoded.role === 'admin';
  return isAdmin || hasAdminRole;
}

export async function GET(request: NextRequest) {
  try {
    // Disable admin verification - allow direct access
    // const isAdmin = await verifyAdmin(request);
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    await connectDB();

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    // Calculate total revenue from all orders
    const allOrders = await Order.find();
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // Get low stock products (stock < 5)
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } }).limit(10);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
