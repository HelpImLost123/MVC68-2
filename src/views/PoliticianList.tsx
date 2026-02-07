/**
 * Politician List View Component
 * 
 * Displays all politicians in a grid layout with their basic information.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PoliticianWithArea } from '@/controllers/PoliticianController';

export default function PoliticianList() {
  const [politicians, setPoliticians] = useState<PoliticianWithArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoliticians = async () => {
      try {
        const response = await fetch('/api/politicians');
        const result = await response.json();

        if (result.success) {
          setPoliticians(result.data);
        } else {
          setError(result.error || 'Failed to fetch politicians');
        }
      } catch (err) {
        setError('Failed to fetch politicians');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticians();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">กำลังโหลด...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (politicians.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">ไม่พบข้อมูลนักการเมือง</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {politicians.map((politician) => (
        <Link
          key={politician.id}
          href={`/politicians/${politician.id}`}
          className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
        >
          {/* Portrait Container */}
          <div className="aspect-square bg-gray-200 relative overflow-hidden">
            {politician.portraitUrl ? (
              <img
                src={politician.portraitUrl}
                alt={politician.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                <svg
                  className="w-24 h-24 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          {/* Info Container */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {politician.name}
            </h3>
            
            <div className="space-y-1 text-sm">
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="truncate">{politician.partyName}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate">{politician.area}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
