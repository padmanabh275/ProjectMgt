const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
    trim: true
  },
  assignedTo: {
    type: String,
    default: 'Unassigned',
    trim: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Delayed'],
    default: 'Not Started'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
taskSchema.index({ companyId: 1, departmentId: 1 });
taskSchema.index({ deadline: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);

