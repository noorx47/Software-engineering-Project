const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const auth = require('../middleware/auth');


router.get('/:listId', auth, async (req, res) => {
  try {
    const items = await Item.find({ listId: req.params.listId })
      .populate('addedBy', 'username');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', auth, [
  // Validate inputs
  body('name')
    .trim()
    .notEmpty().withMessage('Item name is required')
    .isLength({ max: 100 }).withMessage('Item name too long'),
  body('quantity')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Quantity too long'),
  body('category')
    .optional()
    .isIn(['Food', 'Toiletries', 'Other']).withMessage('Invalid category'),
  body('listId')
    .notEmpty().withMessage('List ID is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, quantity, category, listId } = req.body;

    const item = new Item({
      name,
      quantity: quantity || '1',
      category: category || 'Other',
      listId,
      addedBy: req.user.userId
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.patch('/:id/bought', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    item.bought = !item.bought;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;