import { Metadata } from 'next';
import DoctorsPage from './page-content';


export const metadata: Metadata = {
  title: 'General Physician & Internal Medicine Doctors | Book Appointment Online | Apollo 247 Clone',
  description: 'Find the best General Physician & Internal Medicine doctors near you. Book appointments online with experienced doctors at Apollo 247 Clone.',
  keywords: 'general physician, internal medicine, doctor appointment, online consultation, apollo 247, medical consultation',
  openGraph: {
    title: 'General Physician & Internal Medicine Doctors | Book Appointment Online | Apollo 247 Clone',
    description: 'Find the best General Physician & Internal Medicine doctors near you. Book appointments online with experienced doctors at Apollo 247 Clone.',
    url: 'https://apollo-247-clone.com/specialties/general-physician-internal-medicine',
    siteName: 'Apollo 247 Clone',
    images: [{
      url: '/apollo247.svg',
      width: 1200,
      height: 630,
    }],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function Page() {
  return <DoctorsPage />;
}
