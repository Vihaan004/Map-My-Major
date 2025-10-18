'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Map {
  id: string;
  map_name: string;
  start_term: string;
  start_year: number;
  track_total_credits: number;
  status: string;
  created_at: string;
}

interface DashboardClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
  maps: Map[];
  courseCount: number;
  totalCredits: number;
}

export default function DashboardClient({ user, maps, courseCount, totalCredits }: DashboardClientProps) {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  const [newMap, setNewMap] = useState({
    map_name: '',
    start_term: 'FALL',
    start_year: new Date().getFullYear(),
  });

  const handleCreateMap = async () => {
    if (!newMap.map_name.trim()) {
      alert('Please enter a map name');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMap),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/maps/${data.map.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create map');
      }
    } catch (error) {
      alert('Failed to create map');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteMap = async (mapId: string) => {
    if (!confirm('Are you sure you want to delete this map? This cannot be undone.')) {
      return;
    }

    setDeleting(mapId);
    try {
      const response = await fetch(`/api/maps/${mapId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to delete map');
      }
    } catch (error) {
      alert('Failed to delete map');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Minimalistic Top Nav */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            <h1 className="text-base font-semibold text-black">MapMyMajor</h1>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/dashboard" className="text-black hover:underline">Dashboard</Link>
              <Link href="/courses" className="text-gray-600 hover:text-black hover:underline">Course Bank</Link>
              <Link href="/account" className="text-gray-600 hover:text-black hover:underline">Account</Link>
              <span className="text-gray-500">{user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-black mb-1">Dashboard</h2>
          <p className="text-xs text-gray-600">Manage your academic maps and courses</p>
        </div>

        {/* Stats Cards - Minimalistic */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border border-gray-200 p-3">
            <div className="text-xs text-gray-600 mb-1">My Maps</div>
            <div className="text-2xl font-semibold text-black">{maps.length}</div>
          </div>
          <div className="border border-gray-200 p-3">
            <div className="text-xs text-gray-600 mb-1">Course Bank</div>
            <div className="text-2xl font-semibold text-black">{courseCount}</div>
          </div>
          <div className="border border-gray-200 p-3">
            <div className="text-xs text-gray-600 mb-1">Total Credits</div>
            <div className="text-2xl font-semibold text-black">{totalCredits}</div>
          </div>
        </div>

        {/* Maps Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-black">Your Maps</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1 text-xs bg-black text-white hover:bg-gray-800"
            >
              + Create Map
            </button>
          </div>

          {maps.length === 0 ? (
            <div className="border border-gray-200 p-8 text-center">
              <p className="text-xs text-gray-500">No maps yet. Create your first map to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {maps.map((map) => (
                <div key={map.id} className="border border-gray-200 p-3 hover:border-black transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-semibold text-black truncate">{map.map_name}</h4>
                    <span className={`text-[10px] px-2 py-0.5 ${
                      map.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      map.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {map.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 mb-3">
                    <div>Start: {map.start_term} {map.start_year}</div>
                    <div>Credits: {map.track_total_credits || 0}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/maps/${map.id}`}
                      className="flex-1 text-center px-2 py-1 text-[11px] bg-black text-white hover:bg-gray-800"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => handleDeleteMap(map.id)}
                      disabled={deleting === map.id}
                      className="px-2 py-1 text-[11px] border border-gray-300 hover:border-red-500 hover:text-red-500 disabled:opacity-50"
                    >
                      {deleting === map.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/courses"
            className="border border-gray-200 p-4 hover:border-black transition-colors"
          >
            <h4 className="text-sm font-semibold text-black mb-1">Course Bank</h4>
            <p className="text-xs text-gray-600">Browse and manage courses</p>
          </Link>
          <Link
            href="/account"
            className="border border-gray-200 p-4 hover:border-black transition-colors"
          >
            <h4 className="text-sm font-semibold text-black mb-1">Account Settings</h4>
            <p className="text-xs text-gray-600">Manage your profile</p>
          </Link>
        </div>
      </main>

      {/* Create Map Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6">
            <h3 className="text-base font-semibold text-black mb-4">Create New Map</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Map Name *</label>
                <input
                  type="text"
                  value={newMap.map_name}
                  onChange={(e) => setNewMap({ ...newMap, map_name: e.target.value })}
                  placeholder="e.g., BS Computer Science Fall 2024"
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Start Term *</label>
                  <select
                    value={newMap.start_term}
                    onChange={(e) => setNewMap({ ...newMap, start_term: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                  >
                    <option value="FALL">Fall</option>
                    <option value="SPRING">Spring</option>
                    <option value="SUMMER">Summer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-700 mb-1">Start Year *</label>
                  <input
                    type="number"
                    value={newMap.start_year}
                    onChange={(e) => setNewMap({ ...newMap, start_year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateMap}
                disabled={creating}
                className="flex-1 px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Map'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
                className="px-4 py-2 text-sm border border-gray-300 hover:border-black disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
