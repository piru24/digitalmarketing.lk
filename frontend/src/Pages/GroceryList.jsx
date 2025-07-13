import { useState } from 'react';
import GroceryForm from './GroceryForm';
import axios from '../api/axios';
import { FaTrashAlt, FaEdit, FaCheck, FaUndo } from 'react-icons/fa';

const GroceryList = ({ items, refresh }) => {
  const [editItem, setEditItem] = useState(null);
  const token = localStorage.getItem('token');

  const toggleComplete = async (id, isCompleted) => {
    let unitPrice = null;

    if (!isCompleted) {
    const input = prompt('Enter unit price (Rs.):');
    if (input === null) return; // User cancelled

    const parsed = parseFloat(input);

    if (isNaN(parsed) || input.trim() === '' || parsed <= 0) {
      alert('❌ Please enter a valid unit price greater than 0.');
      return;
    }

    unitPrice = parsed;
  }
    try {
      await axios.patch(`/groceries/${id}/complete`,
        { unitPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refresh();
    } catch (err) {
      console.error('Failed to update item:', err);
      alert('Something went wrong while updating the item.');
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`/groceries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refresh();
    } catch (err) {
      console.error('Failed to delete item:', err);
      alert('Failed to delete item.');
    }
  };

  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('');

  const filteredItems = items.filter(item => {
    const categoryMatch = filterCategory === '' || item.category === filterCategory;
    const statusMatch =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && item.completed) ||
      (filterStatus === 'pending' && !item.completed);
    return categoryMatch && statusMatch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'due') return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortBy === 'priority') {
      const order = { high: 1, medium: 2, low: 3 };
      return order[a.priority] - order[b.priority];
    }
    return 0;
  });

  return (
    <>
      {editItem && (
        <GroceryForm
          editItem={editItem}
          refresh={refresh}
          cancelEdit={() => setEditItem(null)}
        />
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select onChange={e => setFilterCategory(e.target.value)} value={filterCategory} className="border rounded px-3 py-1">
          <option value="">All Categories</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Bathroom">Bathroom</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>

        <select onChange={e => setFilterStatus(e.target.value)} value={filterStatus} className="border rounded px-3 py-1">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <select onChange={e => setSortBy(e.target.value)} value={sortBy} className="border rounded px-3 py-1">
          <option value="">Sort By</option>
          <option value="due">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* List */}
      {sortedItems.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <ul className="space-y-3">
          {sortedItems.map(item => (
            <li key={item._id} className="flex justify-between items-center bg-white p-4 rounded shadow">
              <div>
                <p className={`font-medium ${item.completed ? 'line-through text-gray-400' : ''}`}>
                  {item.title} {item.quantity && `(${item.quantity} ${item.unit || ''})`}
                </p>
                <p className="text-sm text-gray-500">
                  {item.category} • Priority: {item.priority} • Due: {item.dueDate?.slice(0, 10)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleComplete(item._id, item.completed)}
                  className={`px-3 py-1 text-white rounded ${item.completed ? 'bg-yellow-600' : 'bg-green-600'} hover:opacity-80`}
                >
                  {item.completed ? 'Undo' : 'Done'}
                </button>
                <button
                  onClick={() => setEditItem(item)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:opacity-80"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:opacity-80"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default GroceryList;
