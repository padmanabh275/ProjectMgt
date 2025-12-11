const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Department = require('../models/Department');
const Company = require('../models/Company');
const { authenticate, checkCompanyAccess } = require('../middleware/auth');

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

// @route   GET /api/departments
// @desc    Get all departments for a company
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required.' });
    }

    // Check company access
    const hasAccess = await verifyCompanyAccess(req, companyId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const departments = await Department.find({ companyId })
      .sort({ name: 1 });

    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   POST /api/departments
// @desc    Create a new department
// @access  Private
router.post('/', authenticate, [
  body('name').trim().notEmpty(),
  body('companyId').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, companyId } = req.body;

    // Check company access
    const hasAccess = await verifyCompanyAccess(req, companyId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    try {
      const department = await Department.create({
        name,
        companyId
      });

      res.status(201).json(department);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Department already exists in this company.' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private
router.put('/:id', authenticate, [
  body('name').optional().trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    // Check company access
    const hasAccess = await verifyCompanyAccess(req, department.companyId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { name } = req.body;
    const updateData = {};
    if (name) updateData.name = name;

    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const Task = require('../models/Task');

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    // Check company access
    const hasAccess = await verifyCompanyAccess(req, department.companyId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Delete all tasks in this department
    await Task.deleteMany({ departmentId: req.params.id });
    await Department.findByIdAndDelete(req.params.id);

    res.json({ message: 'Department and all related tasks deleted successfully.' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
