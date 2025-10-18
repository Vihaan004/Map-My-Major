'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  created_at: string;
}

interface Stats {
  totalMaps: number;
  activeMaps: number;
  totalClasses: number;
  totalCredits: number;
}

interface AccountClientProps {
  user: User;
  stats: Stats;
}

export default function AccountClient({ user, stats }: AccountClientProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            <h1 className="text-base font-semibold text-black">MapMyMajor</h1>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/dashboard" className="text-gray-600 hover:text-black hover:underline">Dashboard</Link>
              <Link href="/courses" className="text-gray-600 hover:text-black hover:underline">Course Bank</Link>
              <Link href="/account" className="text-black hover:underline">Account</Link>
              <span className="text-gray-500">{user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-black mb-1">Account Settings</h2>
          <p className="text-xs text-gray-600">Manage your profile and preferences</p>
        </div>

        {/* Profile Section */}
        <div className="border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-semibold text-black mb-4">Profile Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Name</label>
              <div className="text-sm text-black">{user.name || 'Not provided'}</div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Email</label>
              <div className="text-sm text-black">{user.email}</div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Member Since</label>
              <div className="text-sm text-black">{formatDate(user.created_at)}</div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-semibold text-black mb-4">Your Statistics</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Maps</div>
              <div className="text-2xl font-semibold text-black">{stats.totalMaps}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Active Maps</div>
              <div className="text-2xl font-semibold text-black">{stats.activeMaps}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Classes</div>
              <div className="text-2xl font-semibold text-black">{stats.totalClasses}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Credits</div>
              <div className="text-2xl font-semibold text-black">{stats.totalCredits}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-semibold text-black mb-4">Quick Actions</h3>
          
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="block w-full text-left px-4 py-3 text-sm border border-gray-200 hover:border-black transition-colors"
            >
              <div className="font-medium text-black">Go to Dashboard</div>
              <div className="text-xs text-gray-600">View and manage your maps</div>
            </Link>
            
            <Link
              href="/courses"
              className="block w-full text-left px-4 py-3 text-sm border border-gray-200 hover:border-black transition-colors"
            >
              <div className="font-medium text-black">Course Bank</div>
              <div className="text-xs text-gray-600">Browse and manage courses</div>
            </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-red-200 p-6">
          <h3 className="text-sm font-semibold text-red-600 mb-4">Account Actions</h3>
          
          <div className="space-y-3">
            <div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800"
              >
                Sign Out
              </button>
              <p className="text-xs text-gray-500 mt-1">Sign out of your account</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
