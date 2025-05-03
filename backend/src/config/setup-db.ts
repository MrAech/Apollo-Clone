import pool from './database';
import { DoctorInput } from '../models/doctorModel';

const sampleDoctors: DoctorInput[] = [
  {
    name: 'Dr. Amit Sharma',
    specialty: 'General Physician',
    experience: 15,
    qualifications: 'MBBS, MD (Internal Medicine)',
    location: 'Delhi',
    fees: 800,
    rating: 4.8,
    recommendations: 120,
    profile_image: '/images/doctors/pexels-mastercowley-1300402.jpg',
    consultation_modes: [
      { id: '1', name: 'Online' },
      { id: '2', name: 'Hospital Visit' }
    ],
    languages: [
      { id: '1', name: 'English' },
      { id: '2', name: 'Hindi' }
    ],
    facilities: [
      { id: '1', name: 'Apollo Hospital' }
    ]
  },
  {
    name: 'Dr. Priya Patel',
    specialty: 'General Physician',
    experience: 10,
    qualifications: 'MBBS, DNB (General Medicine)',
    location: 'Mumbai',
    fees: 700,
    rating: 4.6,
    recommendations: 98,
    profile_image: '/images/doctors/pexels-danxavier-1239291.jpg', 
    consultation_modes: [
      { id: '1', name: 'Online' }
    ],
    languages: [
      { id: '1', name: 'English' },
      { id: '3', name: 'Gujarati' }
    ],
    facilities: [
      { id: '2', name: 'Apollo Clinic' }
    ]
  },
  {
    name: 'Dr. Sarah Khan',
    specialty: 'General Physician',
    experience: 8,
    qualifications: 'MBBS, DNB (Family Medicine)',
    location: 'Bangalore',
    fees: 650,
    rating: 4.7,
    recommendations: 85,
    profile_image: '/images/doctors/pexels-pixabay-415829.jpg', 
    consultation_modes: [
      { id: '1', name: 'Online' },
      { id: '2', name: 'Hospital Visit' }
    ],
    languages: [
      { id: '1', name: 'English' },
      { id: '2', name: 'Hindi' },
      { id: '4', name: 'Kannada' }
    ],
    facilities: [
      { id: '1', name: 'Apollo Hospital' },
      { id: '2', name: 'Apollo Clinic' }
    ]
  },
  {
    name: 'Dr. Meera Reddy',
    specialty: 'General Physician',
    experience: 12,
    qualifications: 'MBBS, MD (General Medicine)',
    location: 'Chennai',
    fees: 750,
    rating: 4.9,
    recommendations: 150,
    profile_image: '/images/doctors/pexels-kebs-visuals-742415-3992656.jpg', 
    consultation_modes: [
      { id: '1', name: 'Online' }
    ],
    languages: [
      { id: '1', name: 'English' },
      { id: '5', name: 'Tamil' }
    ],
    facilities: [
      { id: '2', name: 'Apollo Clinic' }
    ]
  },
  {
    name: 'Dr. Rajesh Kumar',
    specialty: 'General Physician',
    experience: 20,
    qualifications: 'MBBS, MD (Internal Medicine), DM',
    location: 'Hyderabad',
    fees: 900,
    rating: 4.9,
    recommendations: 200,
    profile_image: '/images/doctors/pexels-simon-robben-55958-614810.jpg',
    consultation_modes: [
      { id: '1', name: 'Online' },
      { id: '2', name: 'Hospital Visit' }
    ],
    languages: [
      { id: '1', name: 'English' },
      { id: '2', name: 'Hindi' },
      { id: '6', name: 'Telugu' }
    ],
    facilities: [
      { id: '1', name: 'Apollo Hospital' }
    ]
  },
  {
    name: 'Dr. Michael Thomas',
    specialty: 'General Physician',
    experience: 14,
    qualifications: 'MBBS, MD (General Medicine)',
    location: 'Pune',
    fees: 850,
    rating: 4.7,
    recommendations: 110,
    profile_image: '/images/doctors/pexels-stefanstefancik-91227.jpg', 
    consultation_modes: [
      { id: '1', name: 'Online' },
      { id: '2', name: 'Hospital Visit' }
    ],
    languages: [
      { id: '1', name: 'English' },
      { id: '2', name: 'Hindi' },
      { id: '7', name: 'Marathi' }
    ],
    facilities: [
      { id: '1', name: 'Apollo Hospital' },
      { id: '2', name: 'Apollo Clinic' }
    ]
  }
];

async function setupDatabase() {
  try {
    const connection = await pool.getConnection();


    const schema = await import('fs').then(fs =>
      fs.promises.readFile('./src/config/schema.sql', 'utf8')
    );


    const statements = schema.split(';').filter(stmt => stmt.trim());


    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('Schema created successfully');


    for (const doctor of sampleDoctors) {
      const [result] = await connection.query(
        `INSERT INTO doctors (name, specialty, experience, qualifications, location, fees, rating, recommendations, profile_image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          doctor.name,
          doctor.specialty,
          doctor.experience,
          doctor.qualifications,
          doctor.location,
          doctor.fees,
          doctor.rating,
          doctor.recommendations,
          doctor.profile_image
        ]
      );

      const doctorId = (result as any).insertId;


      if (doctor.consultation_modes?.length) {
        await connection.query(
          `INSERT INTO doctor_consultation_modes (doctor_id, mode_id)
           VALUES ?`,
          [doctor.consultation_modes.map(mode => [doctorId, mode.id])]
        );
      }


      if (doctor.languages?.length) {
        await connection.query(
          `INSERT INTO doctor_languages (doctor_id, language_id)
           VALUES ?`,
          [doctor.languages.map(lang => [doctorId, lang.id])]
        );
      }


      if (doctor.facilities?.length) {
        await connection.query(
          `INSERT INTO doctor_facilities (doctor_id, facility_id)
           VALUES ?`,
          [doctor.facilities.map(facility => [doctorId, facility.id])]
        );
      }
    }

    console.log('Sample doctors added successfully');
    connection.release();
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
