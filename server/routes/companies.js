const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Company = require('../models/Company');
const { authenticate, isMasterOrAdmin } = require('../middleware/auth');

// Helper function to check company access inline
const verifyCompanyAccess = async (req, companyId) => {
  if (req.user.role === 'master' || req.user.role === 'admin') {
    return true;
  }
  if (!companyId) {
    return false;
  }
  return req.user.companyId && req.user.companyId.toString() === companyId.toString();
};

// @route   GET /api/companies
// @desc    Get all companies
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    let filter = { isActive: true };

    // Regular users can only see their company
    if (req.user.role === 'user' && req.user.companyId) {
      filter._id = req.user.companyId;
    }

    const companies = await Company.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   GET /api/companies/:id
// @desc    Get single company
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    // Check access
    const hasAccess = await verifyCompanyAccess(req, company._id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(company);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   POST /api/companies
// @desc    Create a new company
// @access  Private (Master/Admin only)
router.post('/', authenticate, isMasterOrAdmin, [
  body('name').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    // Check if company already exists
    const existing = await Company.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ message: 'Company with this name already exists.' });
    }

    const company = await Company.create({
      name,
      createdBy: req.user._id
    });

    const populated = await Company.findById(company._id)
      .populate('createdBy', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   PUT /api/companies/:id
// @desc    Update company
// @access  Private (Master/Admin)
router.put('/:id', authenticate, isMasterOrAdmin, [
  body('name').optional().trim().notEmpty(),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, isActive } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    res.json(company);
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   DELETE /api/companies/:id
// @desc    Delete company
// @access  Private (Master/Admin only)
router.delete('/:id', authenticate, isMasterOrAdmin, async (req, res) => {
  try {
    const Department = require('../models/Department');
    const Task = require('../models/Task');

    // Delete all related departments and tasks
    const departments = await Department.find({ companyId: req.params.id });
    const departmentIds = departments.map(d => d._id);
    
    await Task.deleteMany({ companyId: req.params.id });
    await Department.deleteMany({ companyId: req.params.id });
    await Company.findByIdAndDelete(req.params.id);

    res.json({ message: 'Company and all related data deleted successfully.' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
