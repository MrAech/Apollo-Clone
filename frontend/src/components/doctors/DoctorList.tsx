'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import axios from 'axios';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  qualifications: string;
  location: string;
  fees: number;
  rating?: number;
  recommendations?: number;
  profile_image?: string;
  consultation_modes: { id: string; name: string }[];
  languages: { id: string; name: string }[];
  facilities: { id: string; name: string }[];
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

import { Filters } from '../../types/filters';

interface DoctorListProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const DoctorList = ({ filters, onFilterChange }: DoctorListProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: filters.page || 1,
    limit: 5,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const queryParams = new URLSearchParams();
        if (filters.modeIds?.length) queryParams.set('modeIds', filters.modeIds.join(','));
        if (filters.experienceMin !== undefined) queryParams.set('experienceMin', filters.experienceMin.toString());
        if (filters.experienceMax !== undefined) queryParams.set('experienceMax', filters.experienceMax.toString());
        if (filters.feesMin !== undefined) queryParams.set('feesMin', filters.feesMin.toString());
        if (filters.feesMax !== undefined) queryParams.set('feesMax', filters.feesMax.toString());
        if (filters.languageIds?.length) queryParams.set('languageIds', filters.languageIds.join(','));
        if (filters.facilityIds?.length) queryParams.set('facilityIds', filters.facilityIds.join(','));
        if (filters.sortBy) queryParams.set('sortBy', filters.sortBy);
        if (filters.page) queryParams.set('page', filters.page.toString());
queryParams.set('limit', '5');
        
        const response = await axios.get(`https://apollo-clone-23w1.onrender.com/api/doctors?${queryParams.toString()}`);
        setDoctors(response.data.data.doctors);
        setPagination(response.data.data.pagination);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Could not connect to server. Please ensure the backend server is running on port 5000.');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, [filters]);
  
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-star-${i}`} className="text-yellow-400" />);
    }
    
    return stars;
  };
  
  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    onFilterChange(newFilters);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-sm text-black">
        {pagination.total} General Physician doctors available
      </div>
      
      {doctors.length === 0 ? (
        <div className="bg-white rounded p-6 shadow text-center">
          <p className="text-black">No doctors found matching your filters.</p>
          <p className="text-black mt-2">Try adjusting your filter criteria.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row">

                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">                    
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 relative">
                      {doctor.profile_image ? (
                        <Image 
                          src={doctor.profile_image} 
                          alt={doctor.name}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-xl font-bold">
                          {doctor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  

                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-blue-800">{doctor.name}</h3>
                        <p className="text-black">{doctor.specialty}</p>
                        <p className="text-black">{doctor.qualifications}</p>
                        <p className="text-black">{doctor.experience} years experience</p>
                        

                        <div className="flex items-center mt-2">
                          <MdLocationOn className="text-black mr-1" />
                          <span className="text-black">{doctor.location}</span>
                        </div>
                        

                        {doctor.rating && (
                          <div className="flex items-center mt-1">
                            <div className="flex mr-2">
                              {renderRating(doctor.rating)}
                            </div>
                            <span className="text-black">{doctor.rating} • {doctor.recommendations} recommendations</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:text-right">
                        <p className="text-black">Consultation Fee</p>
                        <p className="text-xl font-bold text-blue-800">₹{doctor.fees}</p>
                        

                        <div className="mt-2 flex flex-wrap gap-2">
                          {doctor.consultation_modes.map(mode => (
                            <span 
                              key={mode.id} 
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {mode.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-3">

                      <div>
                        <p className="text-sm text-black">Languages:</p>
                        <p className="text-sm text-black">
                          {doctor.languages.map(lang => lang.name).join(', ')}
                        </p>
                      </div>

                      {doctor.facilities.length > 0 && (
                        <div className="ml-6">
                          <p className="text-sm text-black">Facilities:</p>
                          <p className="text-sm text-black">
                            {doctor.facilities.map(facility => facility.name).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                        disabled
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          

          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex space-x-2">

                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded ${
                    pagination.page === 1 
                      ? 'bg-gray-200 text-black cursor-not-allowed' 
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      pagination.page === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-3 py-1 rounded ${
                    pagination.page === pagination.totalPages
                      ? 'bg-gray-200 text-black cursor-not-allowed'
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};


export default DoctorList;
