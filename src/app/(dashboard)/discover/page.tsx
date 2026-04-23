'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { db } from '@/lib/appwrite';
import { Host } from '@/types';
import { formatCoins } from '@/utils';
import { Video, MapPin, Star, Filter } from 'lucide-react';

export default function DiscoverPage() {
  const { user } = useAuth();
  const [hosts, setHosts] = useState<Host[]>([]);
  const [filteredHosts, setFilteredHosts] = useState<Host[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    loadHosts();
  }, []);

  useEffect(() => {
    if (showOnlineOnly) {
      setFilteredHosts(hosts.filter(host => host.isOnline));
    } else {
      setFilteredHosts(hosts);
    }
  }, [hosts, showOnlineOnly]);

  const loadHosts = async () => {
    try {
      const hostsData = await db.hosts.list([
        'orderBy=$createdAt',
        'orderType=desc',
      ]);
      setHosts(hostsData.documents as unknown as Host[]);
    } catch (error) {
      console.error('Error loading hosts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Discover Hosts
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    showOnlineOnly
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Online Only
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {filteredHosts.length === 0 ? (
              <div className="text-center py-12">
                <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {showOnlineOnly ? 'No hosts online right now' : 'No hosts available'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {showOnlineOnly
                    ? 'Check back later or browse all hosts'
                    : 'Hosts will appear here once they create their profiles'
                  }
                </p>
                {showOnlineOnly && (
                  <button
                    onClick={() => setShowOnlineOnly(false)}
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Show all hosts
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHosts.map((host) => (
                  <Card key={host.$id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {host.hostPhoto ? (
                            <img
                              src={host.hostPhoto}
                              alt={host.intro}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-gray-600 dark:text-gray-300 font-medium">
                                {host.intro.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg">{host.intro}</CardTitle>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                              {host.isOnline && (
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                  Online
                                </div>
                              )}
                              <span>{formatCoins(host.ratePerMinute)}/min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {host.description || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            4.5 (120 reviews)
                          </span>
                        </div>
                        <Link href={`/host/${host.$id}`}>
                          <Button size="sm">
                            <Video className="h-4 w-4 mr-2" />
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}