'use client';

import { useState } from 'react';

import { Filters } from '../../types/filters';

interface FilterProps {
  onFilterChange: (filters: Filters) => void;
}

export default function FilterPanel({ onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState<Filters>({
    modeIds: [],
    experienceMin: undefined,
    experienceMax: undefined,
    feesMin: undefined,
    feesMax: undefined,
    languageIds: [],
    facilityIds: [],
    sortBy: 'relevance',
    page: 1
  });

  const handleModeChange = (modeId: number) => {
    const newModeIds = filters.modeIds.includes(modeId)
      ? filters.modeIds.filter(id => id !== modeId)
      : [...filters.modeIds, modeId];
    
    const newFilters = { ...filters, modeIds: newModeIds };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleExperienceChange = (min?: number, max?: number) => {
    const newFilters = { ...filters, experienceMin: min, experienceMax: max };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFeesChange = (min?: number, max?: number) => {
    const newFilters = { ...filters, feesMin: min, feesMax: max };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLanguageChange = (languageId: number) => {
    const newLanguageIds = filters.languageIds.includes(languageId)
      ? filters.languageIds.filter(id => id !== languageId)
      : [...filters.languageIds, languageId];
    
    const newFilters = { ...filters, languageIds: newLanguageIds };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFacilityChange = (facilityId: number) => {
    const newFacilityIds = filters.facilityIds.includes(facilityId)
      ? filters.facilityIds.filter(id => id !== facilityId)
      : [...filters.facilityIds, facilityId];
    
    const newFilters = { ...filters, facilityIds: newFacilityIds };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-black">Filter By</h2>


      <div className="mb-6">
        <h3 className="text-md font-medium mb-2 text-black">Consultation Mode</h3>
        <div className="space-y-2">
          <label className="flex items-center text-black">
            <input
              type="checkbox"
              className="mr-2"
              checked={filters.modeIds.includes(1)}
              onChange={() => handleModeChange(1)}
            />
            Video Consultation
          </label>
          <label className="flex items-center text-black">
            <input
              type="checkbox"
              className="mr-2"
              checked={filters.modeIds.includes(2)}
              onChange={() => handleModeChange(2)}
            />
            Hospital Visit
          </label>
        </div>
      </div>


      <div className="mb-6">
        <h3 className="text-md font-medium mb-2 text-black">Experience (Years)</h3>
        <div className="space-y-2">
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="experience"
              className="mr-2"
              onChange={() => handleExperienceChange(0, 5)}
            />
            0-5 years
          </label>
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="experience"
              className="mr-2"
              onChange={() => handleExperienceChange(5, 10)}
            />
            5-10 years
          </label>
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="experience"
              className="mr-2"
              onChange={() => handleExperienceChange(10, undefined)}
            />
            10+ years
          </label>
        </div>
      </div>


      <div className="mb-6">
        <h3 className="text-md font-medium mb-2 text-black">Consultation Fees</h3>
        <div className="space-y-2">
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="fees"
              className="mr-2"
              onChange={() => handleFeesChange(0, 500)}
            />
            ₹0 - ₹500
          </label>
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="fees"
              className="mr-2"
              onChange={() => handleFeesChange(501, 1000)}
            />
            ₹501 - ₹1000
          </label>
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="fees"
              className="mr-2"
              onChange={() => handleFeesChange(1001, undefined)}
            />
            Above ₹1000
          </label>
        </div>
      </div>


      <div className="mb-6">
        <h3 className="text-md font-medium mb-2 text-black">Languages</h3>
        <div className="space-y-2">
          <label className="flex items-center text-black">
            <input
              type="checkbox"
              className="mr-2"
              checked={filters.languageIds.includes(1)}
              onChange={() => handleLanguageChange(1)}
            />
            English
          </label>
          <label className="flex items-center text-black">
            <input
              type="checkbox"
              className="mr-2"
              checked={filters.languageIds.includes(2)}
              onChange={() => handleLanguageChange(2)}
            />
            Hindi
          </label>
        </div>
      </div>


      <div className="mb-6">
        <h3 className="text-md font-medium mb-2 text-black">Sort By</h3>
        <div className="space-y-2">
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="sortBy"
              className="mr-2"
              checked={filters.sortBy === 'relevance'}
              onChange={() => {
                const newFilters = { ...filters, sortBy: 'relevance' };
                setFilters(newFilters);
                onFilterChange(newFilters);
              }}
            />
            Relevance
          </label>
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="sortBy"
              className="mr-2"
              checked={filters.sortBy === 'experience_high'}
              onChange={() => {
                const newFilters = { ...filters, sortBy: 'experience_high' };
                setFilters(newFilters);
                onFilterChange(newFilters);
              }}
            />
            Experience (High to Low)
          </label>
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="sortBy"
              className="mr-2"
              checked={filters.sortBy === 'fees_low'}
              onChange={() => {
                const newFilters = { ...filters, sortBy: 'fees_low' };
                setFilters(newFilters);
                onFilterChange(newFilters);
              }}
            />
            Fees (Low to High)
          </label>
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="sortBy"
              className="mr-2"
              checked={filters.sortBy === 'rating'}
              onChange={() => {
                const newFilters = { ...filters, sortBy: 'rating' };
                setFilters(newFilters);
                onFilterChange(newFilters);
              }}
            />
            Rating
          </label>
        </div>
      </div>


      <div className="mb-6">
        <h3 className="text-md font-medium mb-2 text-black">Hospital Facilities</h3>
        <div className="space-y-2">
          <label className="flex items-center text-black">
            <input
              type="checkbox"
              className="mr-2"
              checked={filters.facilityIds.includes(1)}
              onChange={() => handleFacilityChange(1)}
            />
            Parking Available
          </label>
          <label className="flex items-center text-black">
            <input
              type="checkbox"
              className="mr-2"
              checked={filters.facilityIds.includes(2)}
              onChange={() => handleFacilityChange(2)}
            />
            Pharmacy
          </label>
        </div>
      </div>
    </div>
  );
}
