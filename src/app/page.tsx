import Link from 'next/link';
import { getCurrentUser } from '@/utils/session';
import LogoutButton from '@/views/LogoutButton';
import { PromiseController } from '@/controllers/PromiseController';
import PromiseList from '@/views/PromiseList';

export default async function HomePage() {
  const user = await getCurrentUser();
  const controller = new PromiseController();
  const promises = await controller.getAllPromises('createdAt', 'desc');

  return (
    <div className="space-y-8">
      {/* Main Content: Promise List */}
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            คำมั่นสัญญาทางการเมือง
          </h1>
          <p className="text-gray-600">
            รวมคำมั่นสัญญาของนักการเมืองและการติดตามความคืบหน้า • เรียงตามวันที่ประกาศล่าสุด
          </p>
        </div>

        <PromiseList promises={promises} />
      </div>
    </div>
  );
}
