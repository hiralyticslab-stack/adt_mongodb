const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  marks: {
    type: Number,
    min: [0, 'Marks cannot be less than 0'],
    max: [100, 'Marks cannot exceed 100'],
    default: null
  }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Student email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  profile: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  enrolledCourses: [enrollmentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);