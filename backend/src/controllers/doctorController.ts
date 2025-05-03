import { Request, Response } from 'express';
import { DoctorInput, listDoctorsWithFilters, addDoctor } from '../models/doctorModel';

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const filters = {
      modeIds: req.query.modeIds ? (req.query.modeIds as string).split(',').map(Number) : undefined,
      experienceMin: req.query.experienceMin ? Number(req.query.experienceMin) : undefined,
      experienceMax: req.query.experienceMax ? Number(req.query.experienceMax) : undefined,
      feesMin: req.query.feesMin ? Number(req.query.feesMin) : undefined,
      feesMax: req.query.feesMax ? Number(req.query.feesMax) : undefined,
      languageIds: req.query.languageIds ? (req.query.languageIds as string).split(',').map(Number) : undefined,
      facilityIds: req.query.facilityIds ? (req.query.facilityIds as string).split(',').map(Number) : undefined,
      sortBy: req.query.sortBy as string | undefined,
      page: Number(req.query.page) || 1,
      limit: Math.min(Number(req.query.limit) || 5, 10) 
    };

    const result = await listDoctorsWithFilters(filters);
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Error in getDoctors:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch doctors'
    });
  }
};

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const doctorInput: DoctorInput = req.body;
    const doctorId = await addDoctor(doctorInput);
    
    res.status(201).json({
      status: 'success',
      data: {
        id: doctorId,
        message: 'Doctor added successfully'
      }
    });
  } catch (error) {
    console.error('Error in createDoctor:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add doctor'
    });
  }
};
