/**
 * Promise Update Form Component
 * 
 * Modal form for updating promise progress and status
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PromiseUpdateFormProps {
  promiseId: string;
  currentStatus: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PromiseUpdateForm({
  promiseId,
  currentStatus,
  onClose,
  onSuccess,
}: PromiseUpdateFormProps) {
  const router = useRouter();
  const [updateDetails, setUpdateDetails] = useState('');
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/promise-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promiseId,
          details: updateDetails,
          newStatus,
        }),
      });

      if (response.ok) {
        onSuccess();
        router.push('/promises');
      } else {
        alert('Failed to submit update');
      }
    } catch (error) {
      console.error('Error submitting update:', error);
      alert('Error submitting update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">อัพเดทความคืบหน้า</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานะใหม่
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white"
              required
            >
              <option value="ยังไม่เริ่ม">ยังไม่เริ่ม</option>
              <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
              <option value="เงียบหาย">เงียบหาย</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียดการอัพเดท
            </label>
            <textarea
              value={updateDetails}
              onChange={(e) => setUpdateDetails(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 text-gray-900 bg-white"
              placeholder="อธิบายความคืบหน้าหรือการเปลี่ยนแปลง..."
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-300"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
