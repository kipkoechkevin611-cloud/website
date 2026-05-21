import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order, Product, User } from '@/lib/models';
import { verifyToken } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const query: {
      user?: string;
    } = {};

    if (decoded.isAdmin) {
      // Admin can see all orders
    } else {
      // Regular users can only see their own orders
      query.user = decoded.userId;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('products.product')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    await connectDB();

    const body = await request.json();
    const { products, deliveryAddress, phone, paymentMethod } = body;

    if (!products || !deliveryAddress || !phone || !paymentMethod) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Calculate total price and verify stock
    let totalPrice = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productName}` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      totalPrice += product.price * item.quantity;
      orderProducts.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: decoded.userId,
      products: orderProducts,
      totalPrice,
      deliveryAddress,
      phone,
      paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
    });

    // Clear user's cart
    await User.findByIdAndUpdate(decoded.userId, { cartItems: [] });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
