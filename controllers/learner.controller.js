
import {
  Learner,
  SchoolClass,
  ParentLearnerLink,
  User,
} from '../models/index.js'

// Administrator: list active learner records
export async function getLearners(req, res) {
  try {
    const learners = await Learner.findAll({
      include: [
        {
          model: SchoolClass,
          as: 'schoolClass',
          attributes: ['id', 'name', 'level', 'yearGroup', 'academicYear'],
          required: false,
        },
      ],
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    })

    return res.status(200).json({
      success: true,
      count: learners.length,
      data: learners,
    })
  } catch (error) {
    console.error('Get learners error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve learner records.',
    })
  }
}

// Administrator: create an official learner record
export async function createLearner(req, res) {
  try {
    const {
      admissionNumber,
      firstName,
      lastName,
      dateOfBirth,
      schoolClassId,
      academicYear,
    } = req.body

    if (
      typeof admissionNumber !== 'string' ||
      !admissionNumber.trim() ||
      typeof firstName !== 'string' ||
      !firstName.trim() ||
      typeof lastName !== 'string' ||
      !lastName.trim() ||
      typeof academicYear !== 'string' ||
      !academicYear.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Admission number, first name, last name, and academic year are required.',
      })
    }

    if (dateOfBirth && Number.isNaN(Date.parse(dateOfBirth))) {
      return res.status(400).json({
        success: false,
        message: 'Provide a valid date of birth.',
      })
    }

    if (schoolClassId) {
      const schoolClass = await SchoolClass.findByPk(schoolClassId)

      if (!schoolClass) {
        return res.status(400).json({
          success: false,
          message: 'The selected school class does not exist.',
        })
      }
    }

    const learner = await Learner.create({
      admissionNumber: admissionNumber.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth: dateOfBirth || null,
      schoolClassId: schoolClassId || null,
      academicYear: academicYear.trim(),
    })

    return res.status(201).json({
      success: true,
      message: 'Learner record created successfully.',
      data: learner,
    })
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'That admission number is already registered.',
      })
    }

    console.error('Create learner error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Unable to create the learner record.',
    })
  }
}

// Parent: request a link to an existing learner using admission number
export async function requestLearnerLink(req, res) {
  try {
    const { admissionNumber, relationship } = req.body
    const validRelationships = ['mother', 'father', 'guardian', 'other']

    if (
      typeof admissionNumber !== 'string' ||
      !admissionNumber.trim() ||
      !validRelationships.includes(relationship)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Provide an admission number and a valid relationship.',
      })
    }

    const learner = await Learner.findOne({
      where: { admissionNumber: admissionNumber.trim() },
      attributes: ['id'],
    })

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: 'No learner was found with that admission number.',
      })
    }

    const existingLink = await ParentLearnerLink.findOne({
      where: {
        parentId: req.user.id,
        learnerId: learner.id,
      },
    })

    if (existingLink) {
      if (existingLink.status !== 'rejected') {
        return res.status(409).json({
          success: false,
          message: 'A link request already exists for this learner.',
        })
      }

      existingLink.status = 'pending'
      existingLink.relationship = relationship
      existingLink.reviewedBy = null
      existingLink.reviewedAt = null
      await existingLink.save()

      return res.status(200).json({
        success: true,
        message: 'Your learner link request has been resubmitted for review.',
      })
    }

    await ParentLearnerLink.create({
      parentId: req.user.id,
      learnerId: learner.id,
      relationship,
    })

    return res.status(201).json({
      success: true,
      message: 'Your learner link request has been submitted for approval.',
    })
  } catch (error) {
    console.error('Request learner link error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Unable to submit the learner link request.',
    })
  }
}

// Parent: list only approved learner links belonging to the signed-in parent
export async function getMyLearners(req, res) {
  try {
    const links = await ParentLearnerLink.findAll({
      where: {
        parentId: req.user.id,
        status: 'approved',
      },
      include: [
        {
          model: Learner,
          as: 'learner',
          attributes: [
            'id',
            'admissionNumber',
            'firstName',
            'lastName',
            'schoolClassId',
            'academicYear',
            'status',
          ],
          include: [
            {
              model: SchoolClass,
              as: 'schoolClass',
              attributes: ['id', 'name', 'level', 'yearGroup', 'academicYear'],
              required: false,
            },
          ],
        },
      ],
    })

    return res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    })
  } catch (error) {
    console.error('Get parent learners error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve your linked learners.',
    })
  }
}

// Administrator: list pending parent link requests
export async function getPendingLearnerLinks(req, res) {
  try {
    const links = await ParentLearnerLink.findAll({
      where: { status: 'pending' },
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Learner,
          as: 'learner',
          attributes: ['id', 'admissionNumber', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'ASC']],
    })

    return res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    })
  } catch (error) {
    console.error('Get pending learner links error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve pending learner link requests.',
    })
  }
}

// Administrator: approve or reject a parent link request
export async function reviewLearnerLink(req, res) {
  try {
    const { status } = req.body

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be approved or rejected.',
      })
    }

    const link = await ParentLearnerLink.findByPk(req.params.id)

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Learner link request not found.',
      })
    }

    if (link.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: 'This request has already been reviewed.',
      })
    }

    link.status = status
    link.reviewedBy = req.user.id
    link.reviewedAt = new Date()
    await link.save()

    return res.status(200).json({
      success: true,
      message: `Learner link request ${status}.`,
      data: link,
    })
  } catch (error) {
    console.error('Review learner link error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Unable to review the learner link request.',
    })
  }
}
