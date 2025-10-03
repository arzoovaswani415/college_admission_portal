const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other']
    }
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    }
  },
  academicInfo: {
    course: {
      type: String,
      required: [true, 'Course selection is required'],
      enum: ['Computer Science', 'Engineering', 'Business Administration', 'Medicine', 'Arts', 'Science']
    },
    previousEducation: {
      type: String,
      required: [true, 'Previous education is required'],
      trim: true
    },
    gpa: {
      type: Number,
      min: 0,
      max: 4.0
    }
  },
  documents: {
    resume: {
      name: String,
      size: Number,
      type: String,
      uploaded: Boolean
    },
    transcript: {
      name: String,
      size: Number,
      type: String,
      uploaded: Boolean
    },
    recommendationLetter: {
      name: String,
      size: Number,
      type: String,
      uploaded: Boolean
    },
    other: {
      name: String,
      size: Number,
      type: String,
      uploaded: Boolean
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  reviewNotes: String,
  reviewedBy: String,
  reviewDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Admission', admissionSchema);
