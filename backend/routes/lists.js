const express = require('express');
const router = express.Router();
const List = require('../Models/list');
const auth = require('../middleware/auth');


// Get all lists for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const lists = await List.find({
      members: req.user.userId
    });
    res.json(lists);
  } catch (err) {
    console.error('GET /lists error:', err.message);
    res.status(500).json({ message: err.message });
  }
});


router.post('/', auth, async (req, res) => {
  try {
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


router.delete('/:id', auth, async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.id);
    res.json({ message: 'List deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;