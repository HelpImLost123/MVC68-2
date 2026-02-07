/**
 * Politician Detail View Component
 * 
 * Displays detailed information about a politician and all their promises.
 */

'use client';

import Link from 'next/link';
import { PoliticianWithArea } from '@/controllers/PoliticianController';
import { PromiseModel } from '@/models/PromiseModel';

interface PoliticianDetailProps {
  politician: PoliticianWithArea;
  promises: PromiseModel[];
}

const statusColors: Record<string, string> = {
  'เงียบหาย': 'bg-gray-500',
  'ยังไม่เริ่ม': 'bg-red-500',
  'กำลังดำเนินการ': 'bg-yellow-500',
  'สำเร็จ': 'bg-green-500',
  'ล้มเหลว': 'bg-red-700',
};

export default function PoliticianDetail({ politician, promises }: PoliticianDetailProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Calculate promise statistics
  const promiseStats = {
    total: promises.length,
    เงียบหาย: promises.filter(p => p.status === 'เงียบหาย').length,
    ยังไม่เริ่ม: promises.filter(p => p.status === 'ยังไม่เริ่ม').length,
    กำลังดำเนินการ: promises.filter(p => p.status === 'กำลังดำเนินการ').length,
  };

  return (
    <div className="space-y-8">
      {/* Politician Info Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Portrait */}
          <div className="md:w-80 w-full aspect-square bg-gray-200 flex-shrink-0">
            {politician.portraitUrl ? (
              <img
                src={politician.portraitUrl}
                alt={politician.name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                <svg
                  className="w-32 h-32 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {politician.name}
            </h1>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-lg">
                <svg
                  className="w-6 h-6 mr-3 text-gray-500"
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
                <span className="text-gray-700">{politician.partyName}</span>
              </div>

              <div className="flex items-center text-lg">
                <svg
                  className="w-6 h-6 mr-3 text-gray-500"
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
                <span className="text-gray-700">{politician.area}</span>
              </div>
            </div>

            {/* Promise Statistics */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                สถิติคำมั่นสัญญา
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {promiseStats.total}
                  </div>
                  <div className="text-sm text-gray-600">ทั้งหมด</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {promiseStats.กำลังดำเนินการ}
                  </div>
                  <div className="text-sm text-gray-600">กำลังดำเนินการ</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {promiseStats.ยังไม่เริ่ม}
                  </div>
                  <div className="text-sm text-gray-600">ยังไม่เริ่ม</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">
                    {promiseStats.เงียบหาย}
                  </div>
                  <div className="text-sm text-gray-600">เงียบหาย</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promises Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          คำมั่นสัญญาทั้งหมด ({promises.length})
        </h2>

        {promises.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">ยังไม่มีคำมั่นสัญญา</p>
          </div>
        ) : (
          <div className="space-y-4">
            {promises.map((promise) => (
              <Link
                key={promise.id}
                href={`/promises/${promise.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden border border-gray-200 hover:border-blue-400"
              >
                <div className="p-6">
                  {/* Header: Promise Name and Status */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-4">
                      {promise.name}
                    </h3>
                    <span
                      className={`${
                        statusColors[promise.status] || 'bg-gray-400'
                      } text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap`}
                    >
                      {promise.status}
                    </span>
                  </div>

                  {/* Details */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {promise.details}
                  </p>

                  {/* Date Information */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">📅 ประกาศ:</span>
                      <span>{formatDate(promise.promiseDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">🔄 อัพเดทล่าสุด:</span>
                      <span>{formatDate(promise.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
