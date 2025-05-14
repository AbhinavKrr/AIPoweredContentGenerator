import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        bg-white/20 backdrop-blur-lg
        border border-white/20
        rounded-xl shadow-xl
        p-6 md:p-8
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;