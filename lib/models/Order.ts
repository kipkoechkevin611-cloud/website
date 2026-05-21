import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  products: Array<{
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalPrice: number;
  deliveryAddress: string;
  phone: string;
  paymentMethod: 'M-Pesa' | 'Stripe' | 'Cash on Delivery';
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  orderStatus: 'Pending' | 'Collecting' | 'Delivered' | 'Cancelled';
  mpesaTransactionId?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Please provide a delivery address'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['M-Pesa', 'Stripe', 'Cash on Delivery'],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Collecting', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    mpesaTransactionId: {
      type: String,
    },
    stripePaymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
