'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../../components/layout/Header';
import FilterPanel from '../../../components/filters/FilterPanel';
import DoctorList from '../../../components/doctors/DoctorList';
import { Filters } from '../../../types/filters';

export default function DoctorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    modeIds: searchParams.get('modeIds')?.split(',').map(Number) || [],
    experienceMin: searchParams.get('experienceMin') ? Number(searchParams.get('experienceMin')) : undefined,
    experienceMax: searchParams.get('experienceMax') ? Number(searchParams.get('experienceMax')) : undefined,
    feesMin: searchParams.get('feesMin') ? Number(searchParams.get('feesMin')) : undefined,
    feesMax: searchParams.get('feesMax') ? Number(searchParams.get('feesMax')) : undefined,
    languageIds: searchParams.get('languageIds')?.split(',').map(Number) || [],
    facilityIds: searchParams.get('facilityIds')?.split(',').map(Number) || [],
    sortBy: searchParams.get('sortBy') || 'relevance',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    

    const params = new URLSearchParams();
    if (newFilters.modeIds?.length) params.set('modeIds', newFilters.modeIds.join(','));
    if (newFilters.experienceMin !== undefined) params.set('experienceMin', newFilters.experienceMin.toString());
    if (newFilters.experienceMax !== undefined) params.set('experienceMax', newFilters.experienceMax.toString());
    if (newFilters.feesMin !== undefined) params.set('feesMin', newFilters.feesMin.toString());
    if (newFilters.feesMax !== undefined) params.set('feesMax', newFilters.feesMax.toString());
    if (newFilters.languageIds?.length) params.set('languageIds', newFilters.languageIds.join(','));
    if (newFilters.facilityIds?.length) params.set('facilityIds', newFilters.facilityIds.join(','));
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
    if (newFilters.page !== 1) params.set('page', newFilters.page.toString());

    router.push(`/specialties/general-physician-internal-medicine?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">General Physician</h1>
          <p className="text-gray-600 mt-2">
            Consult with experienced general physicians and internal medicine specialists
          </p>
        </div>
        

        <div className="flex flex-col md:flex-row gap-6">

          <FilterPanel onFilterChange={handleFilterChange} />
          

          <div className="flex-1">
            <DoctorList filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
      

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Apollo 247</h3>
              <ul className="space-y-2">
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Careers</li>
                <li>Mobile Apps</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2">
                <li>Online Doctor Consultation</li>
                <li>Apollo Pharmacy</li>
                <li>Diagnostics</li>
                <li>Health Record</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Specialities</h3>
              <ul className="space-y-2">
                <li>General Physician</li>
                <li>Pediatrician</li>
                <li>Dermatologist</li>
                <li>Orthopedician</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <span className="cursor-pointer">FB</span>
                <span className="cursor-pointer">TW</span>
                <span className="cursor-pointer">IG</span>
                <span className="cursor-pointer">YT</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p>&copy; 2025 Apollo 247 Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
