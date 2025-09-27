const Admission = require('../models/Admission');
const { validationResult } = require('express-validator');

// Get all admissions
const getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ applicationDate: -1 });
    res.json({
      success: true,
      count: admissions.length,
      data: admissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admissions',
      error: error.message
    });
  }
};

// Get admission by ID
const getAdmissionById = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    
    res.json({
      success: true,
      data: admission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admission',
      error: error.message
    });
  }
};

// Create new admission
const createAdmission = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const admission = new Admission(req.body);
    await admission.save();
    
    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully',
      data: admission
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists in our system'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating admission',
      error: error.message
    });
  }
};

// Update admission status
const updateAdmissionStatus = async (req, res) => {
  try {
    const { status, reviewNotes, reviewedBy } = req.body;
    
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes,
        reviewedBy,
        reviewDate: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Admission status updated successfully',
      data: admission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating admission status',
      error: error.message
    });
  }
};

// Delete admission
const deleteAdmission = async (req, res) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);
    
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Admission deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting admission',
      error: error.message
    });
  }
};

// Get admission statistics
const getAdmissionStats = async (req, res) => {
  try {
    const stats = await Admission.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalApplications = await Admission.countDocuments();
    
    res.json({
      success: true,
      data: {
        totalApplications,
        statusBreakdown: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admission statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmissionStatus,
  deleteAdmission,
  getAdmissionStats
};
