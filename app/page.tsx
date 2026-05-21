'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Star, ArrowRight, MessageCircle, Truck, Shield, Heart, Award, MapPin, Phone, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  featured: boolean;
  ratings: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Premium Home Appliances',
      subtitle: 'Transform Your Home with Quality',
      description: 'Fast Delivery to Nakuru, Kericho & Bomet',
      cta: 'Shop Now',
      gradient: 'from-pink-500 via-pink-600 to-rose-500',
      image: '/assets/products/Car Android Player 10  11,500.jpeg',
    },
    {
      title: 'Trusted Christian Business',
      subtitle: 'Serving with Integrity & Excellence',
      description: 'Affordable Prices, Premium Quality',
      cta: 'Explore Products',
      gradient: 'from-rose-500 via-orange-400 to-amber-400',
      image: '/assets/products/Hisense 65 Q6 Series QLED SMART TV 4K @ 73,000.jpeg',
    },
    {
      title: '24-48 Hour Delivery',
      subtitle: 'Quick & Reliable Service',
      description: 'Payment Before Delivery - Safe & Secure',
      cta: 'Order Now',
      gradient: 'from-purple-500 via-pink-500 to-rose-400',
      image: '/assets/products/Vision Plus 55 QLED VIDAA 4K TV @42,000.jpeg',
    },
  ];

  const categories = [
    { name: 'Refrigeration', icon: '🧊', count: 15, description: 'Fridges & Freezers' },
    { name: 'Kitchen Appliances', icon: '🍳', count: 20, description: 'Cookers & Ovens' },
    { name: 'Cooking Appliances', icon: '🔥', count: 18, description: 'Microwaves & More' },
    { name: 'Laundry Appliances', icon: '🧺', count: 12, description: 'Washing Machines' },
    { name: 'Small Home Appliances', icon: '⚡', count: 25, description: 'Blenders & Kettles' },
    { name: 'Electronics', icon: '📺', count: 30, description: 'TVs & Audio' },
  ];

  const testimonials = [
    {
      name: 'Mary Wanjiku',
      location: 'Nakuru',
      text: 'Excellent service! My fridge was delivered within 24 hours. The team was professional and the product is of great quality.',
      rating: 5,
    },
    {
      name: 'John Kamau',
      location: 'Kericho',
      text: 'I bought a washing machine from ILOSUNOT and it has been working perfectly. Great prices and reliable delivery.',
      rating: 5,
    },
    {
      name: 'Grace Chebet',
      location: 'Bomet',
      text: 'Very trustworthy business. They delivered exactly what was promised and the customer service is exceptional.',
      rating: 5,
    },
  ];

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=8');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchProducts();
    })();
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section with Premium Slideshow */}
      <section className="relative h-[700px] md:h-[800px] overflow-hidden">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.1,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
          >
            {/* Blurred product image background */}
            {slide.image && (
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover blur-sm opacity-30"
                  priority
                />
              </div>
            )}

            {/* Elegant overlay pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTJ2LTJoLTJ2LTJoLTJ2MmgydjJoMnYyaDJ2MmgydjJoLTJ2LTJoLTJ2LTJoLTJ2LTJoLTJ2MmgydjJoMnYyaDJ2MmgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
            </div>

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 30 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
                      Welcome to ILOSUNOT JEISO
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-2xl md:text-3xl text-white/90 mb-4 font-light">
                      {slide.subtitle}
                    </p>
                    <p className="text-lg text-white/80 mb-8">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/shop">
                        <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-pink-50 transition-all transform hover:scale-105 shadow-xl">
                          {slide.cta} <ArrowRight className="inline ml-2" />
                        </button>
                      </Link>
                      <a
                        href="https://wa.me/254780558800"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all border-2 border-white/30 flex items-center justify-center"
                      >
                        <MessageCircle className="mr-2" />
                        Chat on WhatsApp
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12 text-gray-900"
          >
            Shop by Category
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(category.name)}`}
                  className="group"
                >
                  <div className="bg-white rounded-elegant-lg shadow-elegant p-6 text-center hover:shadow-elegant-lg transition-all hover:-translate-y-1 card-hover">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">{category.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{category.description}</p>
                    <p className="text-sm text-pink-600 font-semibold">{category.count} Products</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12 text-gray-900"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Truck,
                title: 'Fast Delivery',
                description: '24-48 hour delivery to Nakuru, Kericho, and Bomet regions',
              },
              {
                icon: Shield,
                title: 'Trusted Business',
                description: 'Christian-based business operating with integrity and honesty',
              },
              {
                icon: Award,
                title: 'Quality Brands',
                description: 'We stock only genuine, high-quality home appliances',
              },
              {
                icon: Heart,
                title: 'Affordable Pricing',
                description: 'Competitive prices without compromising on quality',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-b from-pink-50 to-white rounded-elegant-lg shadow-elegant hover:shadow-elegant-lg transition-shadow card-hover"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-900"
            >
              Featured Home Appliances
            </motion.h2>
            <Link href="/shop">
              <Button variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50 rounded-full">View All Products</Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={`/product/${product._id}`}
                    className="bg-white rounded-elegant-lg shadow-elegant overflow-hidden hover:shadow-elegant-lg transition-all group block card-hover"
                  >
                    <div className="relative h-64 bg-gradient-to-br from-pink-100 to-rose-100 group-hover:from-pink-200 group-hover:to-rose-200 transition-colors">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      {product.featured && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{product.ratings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-pink-600">
                          KES {product.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 bg-pink-50 px-2 py-1 rounded-full">{product.category}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12"
          >
            What Our Customers Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/20 backdrop-blur-sm rounded-elegant-lg p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl font-bold text-white">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-white/80">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Info Section */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900">About ILOSUNOT JEISO</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              ILOSUNOT JEISO HOME APPLIANCE is a Christian-based business dedicated to providing
              quality home appliances to families across Kenya. Located in Keringet, Nakuru County,
              we serve customers throughout Nakuru, Kericho, and Bomet regions with fast, reliable delivery.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mb-3 shadow-md">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Location</h3>
                <p className="text-gray-600">Keringet, Nakuru County</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mb-3 shadow-md">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Contact</h3>
                <p className="text-gray-600">0780558800</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mb-3 shadow-md">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Delivery</h3>
                <p className="text-gray-600">24-48 Hours</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
