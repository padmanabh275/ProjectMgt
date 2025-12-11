const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, isMasterOrAdmin } = require('../middleware/auth');

// Helper to verify company access for users
const verifyCompanyAccess = async (req, companyId) => {
  if (req.user.role === 'master') {
    return true;
  }
  if (!companyId) {
    return false;
  }
  return req.user.companyId && req.user.companyId.toString() === companyId.toString();
};

// @route   GET /api/users
// @desc    Get users - Master/Admin for management, all users for team member selection
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { companyId, role, teamMembers } = req.query;
    const filter = { isActive: true };

    // Regular users can see team members from their company (for task assignment)
    if (req.user.role === 'user' && req.user.companyId) {
      filter.companyId = req.user.companyId;
      // Exclude master user for regular users
      filter.role = { $ne: 'master' };
    } else if (req.user.role === 'admin') {
      // Admin can see their company users only (no master)
      if (companyId && req.user.companyId?.toString() === companyId) {
        filter.companyId = companyId;
      } else if (!companyId && req.user.companyId) {
        filter.companyId = req.user.companyId;
      }
      // Always exclude master user for admins when fetching team members
      if (teamMembers === 'true' || companyId) {
        filter.role = { $ne: 'master' };
      }
    }
    
    // Master can see all users or filter by companyId
    if (req.user.role === 'master') {
      if (companyId) {
        filter.companyId = companyId;
      }
      // If no companyId, master sees all users (no filter)
      // Master can see master user too
    }

    // Role filter - only apply if not already set and user is master
    if (role && req.user.role === 'master' && !filter.role) {
      filter.role = role;
    }

    let users = await User.find(filter)
      .populate('companyId', 'name')
      .select('-password')
      .sort({ name: 1 });

    // For team member selection (task assignment)
    // Only include master user if the requester is master themselves
    // Admins should only see users from their company (no master)
    if ((teamMembers === 'true' || companyId) && req.user.role === 'master') {
      const masterUser = await User.findOne({ role: 'master', isActive: true })
        .select('-password');
      if (masterUser && !users.find(u => u._id.toString() === masterUser._id.toString())) {
        users.unshift(masterUser); // Add master at the beginning only for master users
      }
    }

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   POST /api/users
// @desc    Create a new user (Master/Admin only)
// @access  Private (Master/Admin)
router.post('/', authenticate, isMasterOrAdmin, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('role').isIn(['user', 'admin', 'master'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, role = 'user', companyId } = req.body;

    // Only master can create master users
    if (role === 'master' && req.user.role !== 'master') {
      return res.status(403).json({ message: 'Only master users can create other master users.' });
    }

    // Non-masters can only assign to their company
    if (req.user.role !== 'master') {
      if (!req.user.companyId || companyId !== req.user.companyId.toString()) {
        return res.status(403).json({ message: 'You can only create users for your company.' });
      }
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const user = await User.create({
      email,
      password,
      name,
      role,
      companyId: companyId || req.user.companyId
    });

    const userObj = user.toJSON();
    res.status(201).json(userObj);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Master/Admin or self)
router.put('/:id', authenticate, [
  body('name').optional().trim().notEmpty(),
  body('role').optional().isIn(['user', 'admin', 'master']),
  body('companyId').optional().isMongoId(),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;
    const { name, role, companyId, isActive } = req.body;

    // Check permissions
    const isAdminOrMaster = req.user.role === 'master' || req.user.role === 'admin';
    const isSelf = req.user._id.toString() === userId;

    if (!isAdminOrMaster && !isSelf) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (isAdminOrMaster) {
      if (role) {
        // Only master can change roles, and can't change to master unless they are master
        if (req.user.role === 'master') {
          updateData.role = role;
        } else if (role !== 'master') {
          updateData.role = role;
        }
      }
      if (companyId !== undefined && req.user.role === 'master') updateData.companyId = companyId;
      if (isActive !== undefined) updateData.isActive = isActive;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Master/Admin only)
// @access  Private (Master/Admin)
router.delete('/:id', authenticate, isMasterOrAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent deleting self
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   PUT /api/users/:id/password
// @desc    Change user password
// @access  Private (self or Master/Admin)
router.put('/:id/password', authenticate, [
  body('currentPassword').optional().notEmpty(),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    // Check permissions
    const isAdminOrMaster = req.user.role === 'master' || req.user.role === 'admin';
    const isSelf = req.user._id.toString() === userId;

    if (!isAdminOrMaster && !isSelf) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If changing own password, require current password
    if (isSelf && !isAdminOrMaster) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required.' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
