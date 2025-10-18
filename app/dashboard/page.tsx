import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { signOut } from 'next-auth/react';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">MapMyMajor</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Welcome, {user.name || 'Student'}!
          </h2>
          <p className="text-gray-600 mb-6">
            Your dashboard is ready. Start creating your academic maps!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">My Maps</h3>
              <p className="text-sm text-gray-600">View and manage your academic maps</p>
              <p className="text-2xl font-bold text-indigo-600 mt-2">0</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Course Bank</h3>
              <p className="text-sm text-gray-600">Browse available courses</p>
              <p className="text-2xl font-bold text-indigo-600 mt-2">0</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Total Credits</h3>
              <p className="text-sm text-gray-600">Across all your maps</p>
              <p className="text-2xl font-bold text-indigo-600 mt-2">0</p>
            </div>
          </div>

          <div className="mt-8">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Create New Map
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
