/**
 * Promise Detail View Component
 * 
 * Displays detailed information about a single promise
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PromiseWithPolitician } from '@/models/PromiseModel';
import { useState, useEffect } from 'react';
import PromiseUpdateForm from './PromiseUpdateForm';

interface PromiseUpdate {
  id: string;
  promiseId: string;
  updateDate: string;
  details: string;
  newStatus: string;
}

interface PromiseDetailProps {
  promise: PromiseWithPolitician;
  isAdmin: boolean;
}

const statusColors: Record<string, string> = {
  'เงียบหาย': 'bg-gray-500',
  'ยังไม่เริ่ม': 'bg-red-500',
  'กำลังดำเนินการ': 'bg-yellow-500',
};

export default function PromiseDetail({ promise, isAdmin }: PromiseDetailProps) {
  const router = useRouter();
  const [updates, setUpdates] = useState<PromiseUpdate[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, [promise.id]);

  const fetchUpdates = async () => {
    try {
      const response = await fetch(`/api/promise-updates?promiseId=${promise.id}`);
      if (response.ok) {
        const data = await response.json();
        setUpdates(data);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    fetchUpdates();
    router.refresh();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const isUpdateDisabled = promise.status === 'เงียบหาย';

  return (
    <div className="max-w-4xl mx-auto">

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold flex-1 pr-4">{promise.name}</h1>
            <span
              className={`${statusColors[promise.status] || 'bg-gray-400'} px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2`}
            >
            
              <span>{promise.status}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-white/90">
            <span className="text-xl font-semibold">{promise.politicianName}</span>
            <span>•</span>
            <span>{promise.partyName}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Admin Update Button */}
          {isAdmin && (
            <div className="mb-6">
              <button
                onClick={() => setShowUpdateModal(true)}
                disabled={isUpdateDisabled}
                className={`${
                  isUpdateDisabled
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white px-6 py-3 rounded-lg font-medium transition-colors`}
              >
                {isUpdateDisabled ? '🔒 ไม่สามารถอัพเดทได้' : '📝 อัพเดทความคืบหน้า'}
              </button>
            </div>
          )}

          {/* Details */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">รายละเอียดคำมั่นสัญญา</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {promise.details}
            </p>
          </div>

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลเพิ่มเติม</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-sm text-gray-500">วันที่ประกาศ</p>
                  <p className="font-medium text-gray-900">{formatDate(promise.promiseDate)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">🕐</span>
                <div>
                  <p className="text-sm text-gray-500">วันที่สร้างข้อมูล</p>
                  <p className="font-medium text-gray-900">{formatDate(promise.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔄</span>
                <div>
                  <p className="text-sm text-gray-500">อัพเดทล่าสุด</p>
                  <p className="font-medium text-gray-900">{formatDate(promise.updatedAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🆔</span>
                <div>
                  <p className="text-sm text-gray-500">รหัสอ้างอิง</p>
                  <p className="font-mono text-sm text-gray-700">{promise.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Update History */}
          {updates.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📜 ประวัติการอัพเดท</h2>
              <div className="space-y-4">
                {updates.map((update, index) => (
                  <div
                    key={`${update.id}-${index}`}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`${
                          statusColors[update.newStatus] || 'bg-gray-400'
                        } px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1`}
                      >

                        <span>{update.newStatus}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(update.updateDate)}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{update.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <PromiseUpdateForm
          promiseId={promise.id}
          currentStatus={promise.status}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}