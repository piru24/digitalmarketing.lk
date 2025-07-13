import { useState } from 'react';
import axios from '../api/axios';

const categories = ['Kitchen', 'Bathroom', 'Bills', 'Other'];
const units = ['kg', 'liters', 'pcs', 'packets', ''];

const GroceryForm = ({ refresh, editItem = null, cancelEdit }) => {
  const [title, setTitle] = useState(editItem?.title || '');
  const [quantity, setQuantity] = useState(editItem?.quantity || '');
  const [unit, setUnit] = useState(editItem?.unit || '');
  const [category, setCategory] = useState(editItem?.category || '');
  const [priority, setPriority] = useState(editItem?.priority || 'medium');
  const [dueDate, setDueDate] = useState(editItem?.dueDate?.slice(0, 10) || '');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !quantity || quantity <= 0 || !unit || !category || !dueDate) {
      setError('❌ Please fill all fields correctly (quantity must be > 0 and date in future).');
      return;
    }

    const payload = { title, quantity, unit, category, priority, dueDate };

    try {
      if (editItem) {
        await axios.put(`/groceries/${editItem._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        cancelEdit();
      } else {
        await axios.post('/groceries', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Reset form
      setTitle('');
      setQuantity('');
      setUnit('');
      setCategory('');
      setPriority('medium');
      setDueDate('');
      setError('');
      refresh();
    } catch (err) {
      console.error(err);
      setError('Failed to save item. Try again.');
    }
  };

  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd format

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md">
      {error && <p className="text-red-500 mb-2 font-semibold">{error}</p>}

      {/* Row 1: Title, Qty, Unit, Category */}
      <div className="flex flex-col lg:flex-row flex-wrap gap-4 mb-4">
        <input
          className="flex-1 px-3 py-2 border rounded"
          placeholder="Item (e.g., Milk)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          className="w-full sm:w-24 px-3 py-2 border rounded"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <select
          className="w-full sm:w-28 px-3 py-2 border rounded"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
        >
          <option value="">Unit</option>
          {units.map((u) => (
            <option key={u} value={u}>
              {u || 'None'}
            </option>
          ))}
        </select>
        <select
          className="w-full sm:w-40 px-3 py-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Row 2: Priority, Due Date, Button */}
      <div className="flex flex-col lg:flex-row flex-wrap gap-4 items-center">
        <select
          className="px-3 py-2 border rounded w-full sm:w-40"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <input
          type="date"
          className="px-3 py-2 border rounded w-full sm:w-40"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={today}
          required
        />

        <button
          type="submit"
          className="bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700 w-full sm:w-auto"
        >
          {editItem ? 'Update Task' : 'Add Task'}
        </button>

        {editItem && (
          <button
            type="button"
            onClick={cancelEdit}
            className="text-red-500 underline"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default GroceryForm;
