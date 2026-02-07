/**
 * Promises List Page
 * Displays all promises
 */

import { PromiseController } from '@/controllers/PromiseController';
import PromiseList from '@/views/PromiseList';

export default async function PromisesPage() {
  const controller = new PromiseController();
  const promises = await controller.getAllPromises('createdAt', 'desc');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          คำมั่นสัญญาทางการเมือง
        </h1>
        <p className="text-gray-600">
          รวมคำมั่นสัญญาของนักการเมืองและการติดตามความคืบหน้า
        </p>
      </div>

      <PromiseList promises={promises} />
    </div>
  );
}
