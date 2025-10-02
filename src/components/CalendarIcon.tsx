import React from "react";

interface CalendarDateIconProps {
  active?: boolean;
}

const CalendarDateIcon: React.FC<CalendarDateIconProps> = ({ active = false }) => {
  const today = new Date();
  const day = today.getDate();

  const borderColor = active ? "#1f2937" : "#666576";
  const bgColor = active ? "#1f2937" : "#666576";
  const lineColor = active ? "#7a7a88" : "#2c3a50";
  const textColor = active ? "#7a7a88" : "#2c3a50";

  return (
    <div
      className="w-5 h-5 flex flex-col rounded-sm shadow-sm overflow-hidden"
      style={{ border: `1px solid ${borderColor}`, backgroundColor: bgColor }}
    >
      <div
        className="h-[1px] mx-[2px] mt-[4px]"
        style={{ backgroundColor: lineColor }}
      />
      <div className="flex-1 flex items-center justify-center">
        <span
          className="text-[9px] font-bold leading-none"
          style={{ color: textColor }}
        >
          {day}
        </span>
      </div>
    </div>
  );
};

export default CalendarDateIcon;
