
import { SchoolClass } from '../models/index.js'

const VALID_LEVELS = ['Creche', 'Nursery', 'KG', 'Primary', 'JHS']

// List active school classes
export async function getSchoolClasses(req, res) {
  try {
    const classes = await SchoolClass.findAll({
      order: [
        ['academicYear', 'DESC'],
        ['name', 'ASC'],
      ],
    })

    return res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    })
  } catch (error) {
    console.error('Get school classes error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve school classes.',
    })
  }
}

// Create a school class
export async function createSchoolClass(req, res) {
  try {
    const { name, level, yearGroup, academicYear } = req.body

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof yearGroup !== 'string' ||
      !yearGroup.trim() ||
      typeof academicYear !== 'string' ||
      !academicYear.trim() ||
      !VALID_LEVELS.includes(level)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Provide a class name, valid level, year group, and academic year.',
      })
    }

    const schoolClass = await SchoolClass.create({
      name: name.trim(),
      level,
      yearGroup: yearGroup.trim(),
      academicYear: academicYear.trim(),
    })

    return res.status(201).json({
      success: true,
      message: 'School class created successfully.',
      data: schoolClass,
    })
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'A class with this name already exists for that academic year.',
      })
    }

    console.error('Create school class error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Unable to create the school class.',
    })
  }
}
