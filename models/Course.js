const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Course credits are required'],
    min: [1, 'Credits must be at least 1']
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);