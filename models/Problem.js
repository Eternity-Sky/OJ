const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
  isExample: {
    type: Boolean,
    default: false
  }
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['简单', '中等', '困难'],
    required: true
  },
  tags: [{
    type: String
  }],
  timeLimit: {
    type: Number,
    default: 1000 // in milliseconds
  },
  memoryLimit: {
    type: Number,
    default: 256 // in MB
  },
  testCases: [testCaseSchema],
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  }],
  acceptedCount: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for acceptance rate
problemSchema.virtual('acceptanceRate').get(function() {
  if (this.totalSubmissions === 0) return 0;
  return (this.acceptedCount / this.totalSubmissions * 100).toFixed(2);
});

module.exports = mongoose.model('Problem', problemSchema);
