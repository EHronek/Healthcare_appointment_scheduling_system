import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function FloatingActionButton({ to = '/book-appointment', label = 'Book Appointment' }) {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(to)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-br from-blue-700 to-red-600 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      <Plus size={20} />
      <span className="font-semibold">{label}</span>
    </motion.button>
  );
}

export default FloatingActionButton;
