const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String, // optional: e.g., Food, Cleaning
  quantity: String,
  dueDate: Date,
  unit: { type: String, enum: ['kg', 'g', 'liters', 'ml', 'pcs', 'packets', 'none'], default: 'none' },
   completed: { type: Boolean, default: false },
  unitPrice: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('GroceryItem', groceryItemSchema);
