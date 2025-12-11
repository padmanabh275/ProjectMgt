const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Department = require('../models/Department');
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

// @route   GET /api/tasks
// @desc    Get all tasks (with filters)
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { companyId, departmentId, status, assignedTo } = req.query;
    const filter = {};

    // Build filter based on user role
    if (req.user.role === 'user' && req.user.companyId) {
      filter.companyId = req.user.companyId;
    } else if (companyId) {
      filter.companyId = companyId;
    }

    if (departmentId) filter.departmentId = departmentId;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = { $regex: assignedTo, $options: 'i' };

    const tasks = await Task.find(filter)
      .populate('companyId', 'name')
      .populate('departmentId', 'name')
      .populate('createdBy', 'name email')
      .sort({ deadline: 1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('companyId', 'name')
      .populate('departmentId', 'name')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Check company access
    const hasAccess = await verifyCompanyAccess(req, task.companyId._id || task.companyId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', authenticate, [
  body('taskName').trim().notEmpty(),
  body('deadline').isISO8601(),
  body('companyId').isMongoId(),
  body('departmentId').isMongoId(),
  body('status').optional().isIn(['Not Started', 'In Progress', 'Completed', 'Delayed'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskName, assignedTo, deadline, status, companyId, departmentId } = req.body;

    // Check company access
    const hasAccess = await verifyCompanyAccess(req, companyId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Verify department belongs to company
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    if (department.companyId.toString() !== companyId) {
      return res.status(400).json({ message: 'Department does not belong to this company.' });
    }

    const task = await Task.create({
      taskName,
      assignedTo: assignedTo || 'Unassigned',
      deadline,
      status: status || 'Not Started',
      companyId,
      departmentId,
      createdBy: req.user._id
    });

    const populated = await Task.findById(task._id)
      .populate('companyId', 'name')
      .populate('departmentId', 'name')
      .populate('createdBy', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', authenticate, [
  body('taskName').optional().trim().notEmpty(),
  body('deadline').optional().isISO8601(),
  body('status').optional().isIn(['Not Started', 'In Progress', 'Completed', 'Delayed']),
  body('comments').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Check company access
    const hasAccess = await verifyCompanyAccess(req, task.companyId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { taskName, assignedTo, deadline, status, comments } = req.body;
    const updateData = {};

    // Regular users can only update status and comments
    if (req.user.role === 'user') {
      if (status) updateData.status = status;
      if (comments !== undefined) updateData.comments = comments;
    } else {
      // Admin and Master can update all fields
      if (taskName) updateData.taskName = taskName;
      if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
      if (deadline) updateData.deadline = deadline;
      if (status) updateData.status = status;
      if (comments !== undefined) updateData.comments = comments;
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    .populate('companyId', 'name')
    .populate('departmentId', 'name')
    .populate('createdBy', 'name email');

    res.json(updated);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task (Admin/Master only)
// @access  Private (Admin/Master only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Regular users cannot delete tasks
    if (req.user.role === 'user') {
      return res.status(403).json({ message: 'You do not have permission to delete tasks.' });
    }

    // Check company access
    const hasAccess = await verifyCompanyAccess(req, task.companyId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
