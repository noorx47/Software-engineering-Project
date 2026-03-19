const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const List = require('../Models/list');
const User = require('../Models/User');
const auth = require('../middleware/auth');

// Get all lists for the logged in user
router.get('/', auth, async (req, res) => {
  try {
    const lists = await List.find({ members: req.user.userId });
    res.json(lists);
  } catch (err) {
    console.error('GET /lists error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Create a new list
router.post('/', auth, [
  // Validate inputs
  body('name')
    .trim()
    .notEmpty().withMessage('List name is required')
    .isLength({ min: 2 }).withMessage('List name must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('List name too long')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name } = req.body;

    const list = new List({
      name,
      createdBy: req.user.userId,
      members: [req.user.userId]
    });

    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Invite a flatmate by username
router.post('/:id/invite', auth, [
  // Validate inputs
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { username } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the list
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Check if user is already a member
    if (list.members.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Add user to the list
    list.members.push(user._id);
    await list.save();

    res.json({ message: 'Flatmate added successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a list
router.delete('/:id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    await List.findByIdAndDelete(req.params.id);
    res.json({ message: 'List deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;