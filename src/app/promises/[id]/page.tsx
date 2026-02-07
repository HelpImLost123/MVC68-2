/**
 * Promise Detail Page
 * Displays detailed information about a single promise
 */

import { PromiseController } from '@/controllers/PromiseController';
import PromiseDetail from '@/views/PromiseDetail';
import { notFound } from 'next/navigation';
import { getSession } from '@/utils/session';
import Link from 'next/link';

interface PromisePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PromisePage({ params }: PromisePageProps) {
  const { id } = await params;
  const session = await getSession();
  const isAdmin = session?.user.role === 'admin';
  
  const controller = new PromiseController();
  const promise = await controller.getPromiseById(id);

  if (!promise) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
      >
        <span className="mr-2">←</span>
        กลับไปหน้าคำมั่นสัญญา
      </Link>
      <PromiseDetail promise={promise} isAdmin={isAdmin} />
      
      </div>
  );
}
