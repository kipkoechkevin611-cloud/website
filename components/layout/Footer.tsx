import Link from 'next/link';
import { Phone, MapPin, Mail, Heart } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              ILOSUNOT JEISO HOME APPLIANCE
            </h3>
            <p className="text-gray-400 mb-4">
              Premium home appliances for your home. Quality products at affordable prices.
            </p>
            <div className="flex items-start text-gray-400 text-sm">
              <Heart className="w-4 h-4 mr-2 mt-1 text-pink-500" />
              <p>
                A Christian-based business dedicated to serving families with integrity and honesty.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-pink-300">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-pink-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-pink-300">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop?category=Refrigeration" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Refrigeration
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Kitchen Appliances" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Kitchen Appliances
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Cooking Appliances" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Cooking Appliances
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Laundry Appliances" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Laundry Appliances
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Small Home Appliances" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Small Appliances
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Electronics" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Electronics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-pink-300">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-3 text-pink-400" />
                <span>0780558800</span>
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-3 text-pink-400" />
                <span>Keringet, Nakuru County, Kenya</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-3 text-pink-400" />
                <span>info@ilosunot.com</span>
              </li>
            </ul>

            {/* Service Areas */}
            <div className="mt-4">
              <h5 className="text-sm font-semibold mb-2 text-pink-300">Service Areas</h5>
              <p className="text-gray-400 text-sm">Nakuru, Kericho, Bomet</p>
            </div>

            {/* Social Media */}
            <div className="mt-4 flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors transform hover:scale-110" aria-label="Facebook">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors transform hover:scale-110" aria-label="Instagram">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors transform hover:scale-110" aria-label="Twitter">
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} ILOSUNOT JEISO HOME APPLIANCE. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              <span className="text-pink-400 font-semibold">Fast Delivery:</span> 24-48 Hours | Payment Before Delivery
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
