import React from 'react';

const CalendarDateIcon: React.FC = () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('default', { month: 'short' }).toUpperCase();

  return (
    <div className="w-5 h-5 rounded-sm border border-gray-400 bg-white text-center text-[10px] font-semibold text-gray-800 leading-tight flex flex-col items-center justify-center">
      <div className="text-[10px] font-bold">{day}</div>
    </div>
  );
};

export default CalendarDateIcon;
