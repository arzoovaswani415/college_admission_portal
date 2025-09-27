const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmissionStatus,
  deleteAdmission,
  getAdmissionStats
} = require('../controllers/admissionController');

// Validation middleware
const validateAdmission = [
  body('personalInfo.firstName').notEmpty().withMessage('First name is required'),
  body('personalInfo.lastName').notEmpty().withMessage('Last name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required'),
  body('personalInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('personalInfo.dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('personalInfo.gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.zipCode').notEmpty().withMessage('Zip code is required'),
  body('address.country').notEmpty().withMessage('Country is required'),
  body('academicInfo.course').isIn(['Computer Science', 'Engineering', 'Business Administration', 'Medicine', 'Arts', 'Science']).withMessage('Valid course selection is required'),
  body('academicInfo.previousEducation').notEmpty().withMessage('Previous education is required')
];

// Routes
router.get('/', getAllAdmissions);
router.get('/stats', getAdmissionStats);
router.get('/:id', getAdmissionById);
router.post('/', validateAdmission, createAdmission);
router.put('/:id/status', updateAdmissionStatus);
router.delete('/:id', deleteAdmission);

module.exports = router;
