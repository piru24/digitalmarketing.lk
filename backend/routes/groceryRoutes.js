const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  toggleComplete,
  getMonthlyReport} = require('../controllers/groceryController');

router.use(auth); // protect all routes below

router.post('/', createItem);
router.get('/', getItems);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.patch('/:id/complete', toggleComplete);
router.get('/report/monthly', getMonthlyReport);

module.exports = router;
