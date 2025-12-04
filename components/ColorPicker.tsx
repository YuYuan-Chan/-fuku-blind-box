import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}
const COLORS = [
  '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#881337',
  '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#7c2d12',
  '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#78350f',
  '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d',
  '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59',
  '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e3a8a',
  '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#312e81',
  '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#581c87',
  '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#1e293b',
];
const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelect }) => {
  return (
    <div className="grid grid-cols-8 gap-2 p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 shadow-inner max-w-xs mx-auto">
      {COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          className={"w-6 h-6 rounded-full shadow-sm transition-transform hover:scale-125 focus:outline-none " + (selectedColor === color ? 'ring-2 ring-slate-800 scale-110 z-10' : 'hover:z-10')}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
};
export default ColorPicker;
