import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { verifyToken } from '@/lib/jwt';

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('adminToken')?.value;
  if (!token) return false;
  const decoded = verifyToken(token);
  if (!decoded) return false;
  // Accept access if isAdmin === true OR role === "admin"
  const isAdmin = decoded.isAdmin === true;
  const hasAdminRole = decoded.role === 'admin';
  return isAdmin || hasAdminRole;
}

function validateProductData(body: {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  stock?: number;
}) {
  const errors: string[] = [];

  if (!body.name || body.name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!body.description || body.description.trim().length === 0) {
    errors.push('Product description is required');
  }

  if (!body.price || isNaN(body.price) || body.price < 0) {
    errors.push('Valid price is required');
  }

  if (!body.category || body.category.trim().length === 0) {
    errors.push('Product category is required');
  }

  if (!body.image || body.image.trim().length === 0) {
    errors.push('Product image URL is required');
  }

  if (body.stock === undefined || isNaN(body.stock) || body.stock < 0) {
    errors.push('Valid stock quantity is required');
  }

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    // Disable admin verification - allow direct access
    // const isAdmin = await verifyAdmin(request);
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized. Admin access required.' },
    //     { status: 401 }
    //   );
    // }

    await connectDB();
    const body = await request.json();

    // Validate input
    const validationErrors = validateProductData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    const product = await Product.create(body);

    return NextResponse.json({
      success: true,
      product,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create product error:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: ['Invalid product data'] },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.name === 'MongoError' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'A product with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Disable admin verification - allow direct access
    // if (!(await verifyAdmin(request))) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });

    return NextResponse.json({
      products,
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products. Please try again.' },
      { status: 500 }
    );
  }
}
