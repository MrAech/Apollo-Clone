'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">

          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/apollo247.svg"
                alt="Apollo 247"
                width={140}
                height={40}
                className="mr-2"
              />
            </Link>
          </div>

          <div className="hidden md:flex bg-gray-100 rounded-full px-4 py-2 flex-1 max-w-lg mx-4 ">
            <FaSearch className="text-black mr-2" />
            <input
              type="text"
              
              className="bg-transparent border-none focus:outline-none w-full text-black placeholder-black"
              disabled
            />
          </div>
          

          <div className="flex items-center">
            <nav className="hidden md:flex space-x-6">
              <Link href="#" className="text-black hover:text-blue-600">
                Doctors
              </Link>
              <Link href="#" className="text-black hover:text-blue-600">
                Pharmacy
              </Link>
              <Link href="#" className="text-black hover:text-blue-600">
                Lab Tests
              </Link>
            </nav>
            

            <div className="flex items-center ml-6 space-x-4">
              <button className="text-black hover:text-blue-600" aria-label="Cart">
                <FaShoppingCart size={18} />
              </button>
              <button className="text-black hover:text-blue-600" aria-label="User Account">
                <FaUser size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
