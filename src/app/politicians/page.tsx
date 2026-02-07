/**
 * Politicians Page
 * 
 * Displays all politicians in a grid layout
 */

import PoliticianList from '@/views/PoliticianList';

export default function PoliticiansPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          นักการเมือง
        </h1>
        <p className="text-gray-600 text-lg">
          รายชื่อนักการเมืองและคำมั่นสัญญาของพวกเขา
        </p>
      </div>

      {/* Politician Grid */}
      <PoliticianList />
    </div>
  );
}
