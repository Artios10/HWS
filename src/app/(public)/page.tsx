import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { APP_NAME, DEFAULT_COIN_PACKAGES } from '@/constants';
import { formatCurrency, formatCoins } from '@/utils';
import { Heart, Video, Shield, Star, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                {APP_NAME}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Sign In
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Connect Through
            <span className="text-blue-600 block">Video Calls</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience meaningful connections with amazing people. Safe, premium video dating platform
            where you pay for what matters - real conversations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Start Meeting People
              </Button>
            </Link>
            <Link href="/discover">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Browse Hosts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose {APP_NAME}?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Premium features designed for genuine connections
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                HD Video Calls
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Crystal clear video quality for the best conversation experience
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Safe & Secure
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced moderation and safety features to protect our community
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Instant Connections
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with hosts instantly when they're online
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Simple steps to start your video dating journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sign Up
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create your profile and tell us about yourself
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Buy Coins
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Purchase coins to start video conversations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Find Hosts
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse available hosts and start conversations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Connect
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enjoy meaningful video conversations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Coin Packages
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Choose the package that fits your conversation needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DEFAULT_COIN_PACKAGES.map((pkg) => (
              <Card key={pkg.id} className={`relative ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {pkg.name}
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mb-4">
                    {formatCurrency(pkg.price)}
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {formatCoins(pkg.coins)}
                  </div>
                  {pkg.bonus && (
                    <div className="text-sm text-green-600 font-medium mb-4">
                      + {pkg.bonus} bonus coins
                    </div>
                  )}
                  <Link href="/buy-coins">
                    <Button className="w-full" variant={pkg.popular ? 'default' : 'outline'}>
                      Buy Now
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trust & Safety First
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your safety is our top priority. We use advanced moderation tools and community guidelines
            to ensure a positive experience for everyone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">Verified Profiles</span>
            </div>
            <div className="flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">Active Moderation</span>
            </div>
            <div className="flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">Quality Assurance</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Connecting?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have found meaningful connections through video conversations.
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-lg font-bold">{APP_NAME}</span>
              </div>
              <p className="text-gray-400">
                Connecting people through meaningful video conversations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/discover" className="hover:text-white">Discover</Link></li>
                <li><Link href="/buy-coins" className="hover:text-white">Buy Coins</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/community-rules" className="hover:text-white">Community Rules</Link></li>
                <li><a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@launchtime.com'}`} className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {APP_NAME}. All rights reserved.</p>
            <p className="mt-2">
              Made with ❤️ for genuine connections
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}