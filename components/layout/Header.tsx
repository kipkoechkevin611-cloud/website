'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-elegant sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-elegant overflow-hidden shadow-md">
              <Image
                src="/assets/products/logo.jpeg"
                alt="ILOSUNOT JEISO Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-pink-600 group-hover:text-pink-700 transition-colors">
                ILOSUNOT JEISO
              </h1>
              <p className="text-xs text-gray-600">Home Appliance</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
              Shop
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
              Contact
            </Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative text-gray-700 hover:text-pink-600">
                <ShoppingCart className="w-5 h-5 mr-1" />
                Cart
                {user?.cartItems && user.cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {user.cartItems.length}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/orders">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-pink-600">
                    Orders
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="text-gray-700 hover:text-pink-600">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-pink-600">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-gray-700 hover:text-pink-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-gradient-to-b from-pink-50 to-white"
            >
              <nav className="flex flex-col space-y-4 py-6 px-4">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-pink-600 py-2 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="text-gray-700 hover:text-pink-600 py-2 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-pink-600 py-2 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-pink-600 py-2 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/cart"
                  className="text-gray-700 hover:text-pink-600 py-2 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart ({user?.cartItems?.length || 0})
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/orders"
                      className="text-gray-700 hover:text-pink-600 py-2 font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-pink-600 py-2 text-left font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-pink-600 py-2 font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="text-gray-700 hover:text-pink-600 py-2 font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
