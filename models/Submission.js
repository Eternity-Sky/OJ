// const mongoose = require('mongoose');

// const submissionSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   problem: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Problem',
//     required: true
//   },
//   language: {
//     type: String,
//     required: true
//   },
//   code: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Running', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 
//            'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error'],
//     default: 'Pending'
//   },
//   executionTime: {
//     type: Number
//   },
//   memoryUsed: {
//     type: Number
//   },
//   testCasesPassed: {
//     type: Number,
//     default: 0
//   },
//   totalTestCases: {
//     type: Number,
//     default: 0
//   },
//   errorMessage: String,
//   submittedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Submission', submissionSchema);
