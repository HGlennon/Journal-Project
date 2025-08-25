import React from 'react';

const CalendarDateIcon: React.FC = () => {
  const today = new Date();
  const day = today.getDate();

  return (
    <div className="w-5 h-5 rounded-sm border border-gray-600 bg-gray-600 text-center text-[10px] font-semibold text-gray-800 flex flex-col overflow-hidden shadow-sm relative">
      {/* Divider line slightly above the date */}
      <div className="absolute top-[4px] mx-auto left-0 right-0 w-4 h-[1px] bg-gray-400" />

      <div className="flex-1 flex items-center justify-center text-[10px] font-bold pt-[2px]">
        {day}
      </div>
    </div>
  );
};

export default CalendarDateIcon;
