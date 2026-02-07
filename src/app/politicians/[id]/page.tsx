/**
 * Politician Detail Page
 * 
 * Displays detailed information about a single politician and all their promises
 */

import { notFound } from 'next/navigation';
import { PoliticianController } from '@/controllers/PoliticianController';
import PoliticianDetail from '@/views/PoliticianDetail';
import Link from 'next/link';

interface PoliticianPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PoliticianPage({ params }: PoliticianPageProps) {
  const { id } = await params;
  
  const controller = new PoliticianController();
  const result = await controller.getWithPromises(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const { politician, promises } = result.data;

  // Convert class instances to plain objects for client component
  const plainPolitician = {
    id: politician.id,
    name: politician.name,
    partyName: politician.partyName,
    portraitUrl: politician.portraitUrl,
    area: politician.area,
  };

  const plainPromises = promises.map(p => ({
    id: p.id,
    politicianId: p.politicianId,
    name: p.name,
    details: p.details,
    promiseDate: p.promiseDate,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mt-8">
        <Link
          href="/politicians"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          กลับไปหน้ารายชื่อนักการเมือง
        </Link>
      </div>

      {/* Politician Detail Component */}
      <PoliticianDetail politician={plainPolitician} promises={plainPromises} />

      
    </div>
  );
}
