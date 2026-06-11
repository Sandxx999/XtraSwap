import React from 'react';
import { motion } from 'framer-motion';

interface CategoryChipProps {
  label: string;
  icon?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryChip = ({ label, icon, isActive, onClick }: CategoryChipProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ backgroundColor: isActive ? '#1E40AF' : '#EFF6FF' }}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border
        ${isActive 
          ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
          : 'bg-white text-secondary-foreground border-border hover:border-primary/30'
        }
      `}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span>{label}</span>
    </motion.button>
  );
};

export default CategoryChip;