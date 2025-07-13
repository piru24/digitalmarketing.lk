const GroceryItem = require('../models/GroceryItem');

exports.createItem = async (req, res) => {
  try {
    const item = await GroceryItem.create({ ...req.body, userId: req.user.userId });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await GroceryItem.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await GroceryItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await GroceryItem.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    res.json({ msg: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.toggleComplete = async (req, res) => {
  try {
    const item = await GroceryItem.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!item) return res.status(404).json({ msg: 'Item not found' });

    item.completed = !item.completed;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleComplete = async (req, res) => {
  try {
    const item = await GroceryItem.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!item) return res.status(404).json({ msg: 'Item not found' });

    item.completed = !item.completed;
    item.completedAt = item.completed ? new Date() : null;

    // ✅ Only update price if completed
    if (item.completed && req.body.unitPrice) {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(req.body.unitPrice) || 0;

      item.unitPrice = price;
      item.totalCost = qty * price; // 💸 Save total cost too
    } else if (!item.completed) {
      item.unitPrice = 0;
      item.totalCost = 0;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// controller
exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const selectedYear = parseInt(year) || now.getFullYear();
    const selectedMonth = parseInt(month) || now.getMonth(); // 0-indexed

    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    const items = await GroceryItem.find({
      userId: req.user.userId,
      completed: true,
      updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const summary = {};
    let totalExpense = 0;

    items.forEach(item => {
      const key = `${item.title} (${item.unit})`;
      const qty = parseFloat(item.quantity) || 0;
      const cost = item.totalCost || 0;

      if (!summary[key]) summary[key] = { quantity: 0, expense: 0 };
      summary[key].quantity += qty;
      summary[key].expense += cost;
      totalExpense += cost;
    });

    res.json({
      month: startOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
      summary,
      totalExpense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
