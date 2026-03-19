const express = require('express');
const router = express.Router();
const Item = require('../Models/item');
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


router.post('/', auth, async (req, res) => {
  try {
    const { name, quantity, category, listId } = req.body;
    const item = new Item({
      name,
      quantity,
      category,
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
    item.bought = !item.bought;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;