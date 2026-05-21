import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User, Product } from '@/lib/models';
import { verifyToken } from '@/lib/utils/auth';
import mongoose from 'mongoose';

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

    const user = await User.findById(decoded.userId).populate('wishlist');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Please provide productId' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isInWishlist = user.wishlist.some(
      (id: mongoose.Types.ObjectId) => id.toString() === productId
    );

    if (isInWishlist) {
      user.wishlist = user.wishlist.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== productId
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    await user.populate('wishlist');

    return NextResponse.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Update wishlist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
