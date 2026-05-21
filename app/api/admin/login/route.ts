import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Automatic admin seeding: if user is the designated admin email, ensure admin privileges
    const adminEmails = ['kipkoechkevin611@gmaill.com', 'kipkoechkevin611@gmail.com'];
    if (adminEmails.includes(email)) {
      if (!user.isAdmin || user.role !== 'admin') {
        user.isAdmin = true;
        user.role = 'admin';
        await user.save();
        console.log('Auto-seeded admin privileges for:', email);
      }
    }

    // Check if user is admin
    if (!user.isAdmin || user.role !== 'admin') {
      console.log('Access denied for:', email, 'isAdmin:', user.isAdmin, 'role:', user.role);
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Debug logging
    console.log('Login successful for:', email, {
      isAdmin: user.isAdmin,
      role: user.role,
      isAdminType: typeof user.isAdmin,
      roleType: typeof user.role
    });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      },
      token,
    });

    response.cookies.delete('adminToken');
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
