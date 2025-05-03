import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface ConsultationMode {
  id: string;
  name: string;
}

interface Language {
  id: string;
  name: string;
}

interface Facility {
  id: string;
  name: string;
}

export interface Doctor extends RowDataPacket {
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

export interface DoctorFilters {
  modeIds?: number[];
  experienceMin?: number;
  experienceMax?: number;
  feesMin?: number;
  feesMax?: number;
  languageIds?: number[];
  facilityIds?: number[];
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const listDoctorsWithFilters = async (filters: DoctorFilters) => {
  try {
    const {
      modeIds,
      experienceMin,
      experienceMax,
      feesMin,
      feesMax,
      languageIds,
      facilityIds,
      sortBy = 'relevance',
      page = 1,
      limit = 10
    } = filters;

    const offset = (page - 1) * limit;

    let query = `
      SELECT DISTINCT
        d.*,
        GROUP_CONCAT(DISTINCT JSON_OBJECT('id', cm.id, 'name', cm.name)) as consultation_modes,
        GROUP_CONCAT(DISTINCT JSON_OBJECT('id', l.id, 'name', l.name)) as languages,
        GROUP_CONCAT(DISTINCT JSON_OBJECT('id', f.id, 'name', f.name)) as facilities
      FROM doctors d
      LEFT JOIN doctor_consultation_modes dcm ON d.id = dcm.doctor_id
      LEFT JOIN consultation_modes cm ON dcm.mode_id = cm.id
      LEFT JOIN doctor_languages dl ON d.id = dl.doctor_id
      LEFT JOIN languages l ON dl.language_id = l.id
      LEFT JOIN doctor_facilities df ON d.id = df.doctor_id
      LEFT JOIN facilities f ON df.facility_id = f.id
      WHERE 1=1
    `;

    const values: any[] = [];


    if (modeIds && modeIds.length > 0) {
      query += ` AND dcm.mode_id IN (?)`;
      values.push(modeIds);
    }

    if (experienceMin !== undefined) {
      query += ` AND d.experience >= ?`;
      values.push(experienceMin);
    }

    if (experienceMax !== undefined) {
      query += ` AND d.experience <= ?`;
      values.push(experienceMax);
    }

    if (feesMin !== undefined) {
      query += ` AND d.fees >= ?`;
      values.push(feesMin);
    }

    if (feesMax !== undefined) {
      query += ` AND d.fees <= ?`;
      values.push(feesMax);
    }

    if (languageIds && languageIds.length > 0) {
      query += ` AND dl.language_id IN (?)`;
      values.push(languageIds);
    }

    if (facilityIds && facilityIds.length > 0) {
      query += ` AND df.facility_id IN (?)`;
      values.push(facilityIds);
    }


    query += ` GROUP BY d.id`;


    switch (sortBy) {
      case 'experience_high':
        query += ` ORDER BY d.experience DESC`;
        break;
      case 'experience_low':
        query += ` ORDER BY d.experience ASC`;
        break;
      case 'fees_high':
        query += ` ORDER BY d.fees DESC`;
        break;
      case 'fees_low':
        query += ` ORDER BY d.fees ASC`;
        break;
      case 'rating':
        query += ` ORDER BY d.rating DESC`;
        break;
      default:
        query += ` ORDER BY d.recommendations DESC`;
    }


    query += ` LIMIT ? OFFSET ?`;
    values.push(limit, offset);


    const countQuery = `
      SELECT COUNT(DISTINCT d.id) as total
      FROM doctors d
      LEFT JOIN doctor_consultation_modes dcm ON d.id = dcm.doctor_id
      LEFT JOIN doctor_languages dl ON d.id = dl.doctor_id
      LEFT JOIN doctor_facilities df ON d.id = df.doctor_id
      WHERE 1=1
    `;


    const [rows] = await pool.query<Doctor[]>(query, values);
    const [countResult] = await pool.query<(RowDataPacket & { total: number })[]>(
      countQuery,
      values.slice(0, -2)
    );


    const doctors = rows.map(doctor => ({
      ...doctor,
      consultation_modes: JSON.parse(`[${doctor.consultation_modes}]`),
      languages: JSON.parse(`[${doctor.languages}]`),
      facilities: JSON.parse(`[${doctor.facilities}]`)
    }));

    return {
      doctors,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    };
  } catch (error) {
    console.error('Error in listDoctorsWithFilters:', error);
    throw error;
  }
};

export interface DoctorInput {
  name: string;
  specialty: string;
  experience: number;
  qualifications: string;
  location: string;
  fees: number;
  rating?: number;
  recommendations?: number;
  profile_image?: string;
  consultation_modes?: ConsultationMode[];
  languages?: Language[];
  facilities?: Facility[];
}

export const addDoctor = async (doctor: DoctorInput) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();


    const [result] = await connection.query<ResultSetHeader>(
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

    const doctorId = result.insertId;


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

    await connection.commit();
    return doctorId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
