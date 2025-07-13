import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, ChefHat, Award, Star } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <ChefHat className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  MunchHaven
                </h3>
                <p className="text-xs text-gray-400">munchhaven.co.ke</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Experience exquisite dining delivered directly to your room. Premium quality, exceptional service,
              unforgettable flavors crafted with passion.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-pink-500 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center">
              <Phone className="h-5 w-5 mr-2 text-orange-400" />
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-gray-300 text-sm">
                  <p className="font-medium">Nairobi, Kenya</p>
                  <p className="text-gray-400">Premium Hotel District</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm font-medium">+254 703 781 668</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@munchhaven.co.ke</span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-400" />
              Operating Hours
            </h4>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium text-white">24/7 Room Service</span>
                </div>
                <div className="text-gray-300 text-sm space-y-1">
                  <p>🌅 Breakfast: 6:00 AM - 11:00 AM</p>
                  <p>🍽️ Lunch: 12:00 PM - 4:00 PM</p>
                  <p>🌙 Dinner: 6:00 PM - 11:00 PM</p>
                  <p>🌃 Late Night: 11:00 PM - 6:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center">
              <Award className="h-5 w-5 mr-2 text-orange-400" />
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                className="text-gray-300 hover:text-orange-400 transition-colors text-sm py-2 px-3 rounded-lg hover:bg-white/5"
              >
                Order Food
              </Link>
              <Link
                href="/menu"
                className="text-gray-300 hover:text-orange-400 transition-colors text-sm py-2 px-3 rounded-lg hover:bg-white/5"
              >
                View Menu
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-orange-400 transition-colors text-sm py-2 px-3 rounded-lg hover:bg-white/5"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-orange-400 transition-colors text-sm py-2 px-3 rounded-lg hover:bg-white/5"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-gray-300 hover:text-orange-400 transition-colors text-sm py-2 px-3 rounded-lg hover:bg-white/5"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-300 hover:text-orange-400 transition-colors text-sm py-2 px-3 rounded-lg hover:bg-white/5"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">© 2024 MunchHaven. All rights reserved.</p>
              <div className="h-4 w-px bg-gray-600"></div>
              <p className="text-gray-400 text-sm">munchhaven.co.ke</p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-gray-400 text-sm">Crafted with</p>
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
              <p className="text-gray-400 text-sm">for exceptional dining experiences</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
