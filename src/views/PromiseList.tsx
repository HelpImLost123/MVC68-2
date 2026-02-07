/**
 * Promise List View Component
 * 
 * Displays a list of promises with politician information
 */

'use client';

import Link from 'next/link';
import { PromiseWithPolitician } from '@/models/PromiseModel';

interface PromiseListProps {
  promises: PromiseWithPolitician[];
}

const statusColors: Record<string, string> = {
  'เงียบหาย': 'bg-gray-500',
  'ยังไม่เริ่ม': 'bg-red-500',
  'กำลังดำเนินการ': 'bg-yellow-500',
};

export default function PromiseList({ promises }: PromiseListProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (promises.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">ไม่มีคำมั่นสัญญา</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {promises.map((promise) => (
        <Link
          key={promise.id}
          href={`/promises/${promise.id}`}
          className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden border border-gray-200 hover:border-blue-400"
        >
          <div className="p-5">
            {/* Header: Promise Name and Status */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-4">
                {promise.name}
              </h3>
              <span
                className={`${statusColors[promise.status] || 'bg-gray-400'} text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1`}
              >
                <span>{promise.status}</span>
              </span>
            </div>

            {/* Politician Info */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-blue-600 font-medium text-lg">
                {promise.politicianName}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 text-sm">{promise.partyName}</span>
            </div>

            {/* Details Preview */}
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
                <span className="font-medium">🕐 สร้าง:</span>
                <span>{formatDate(promise.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">🔄 อัพเดท:</span>
                <span>{formatDate(promise.updatedAt)}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
