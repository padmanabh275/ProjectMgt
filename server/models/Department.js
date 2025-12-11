const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  }
}, {
  timestamps: true
});

// Ensure unique department names per company
departmentSchema.index({ companyId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Department', departmentSchema);

