import React from 'react';
import { useAppStore } from '../../lib/store';

export const ActivityHeatmap = () => {
  const { activityData } = useAppStore();

  const getIntensity = (count) => {
    if (count === 0) return 'bg-gray-800';
    if (count <= 2) return 'bg-primary-900/30';
    if (count <= 5) return 'bg-primary-700/50';
    if (count <= 8) return 'bg-primary-500/70';
    return 'bg-primary-500';
  };

  const getTooltip = (date, count) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    return `${formattedDate}: ${count} ${count === 1 ? 'activity' : 'activities'}`;
  };

  const weeks = [];
  let currentWeek = [];
  
  // Group data by weeks
  activityData.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === activityData.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <div className="glass-dark rounded-2xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Activity Overview</h3>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex space-x-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col space-y-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${getIntensity(day.count)} hover:ring-2 hover:ring-primary-400 transition-all cursor-pointer`}
                    title={getTooltip(day.date, day.count)}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-sm bg-gray-800"></div>
              <div className="w-3 h-3 rounded-sm bg-primary-900/30"></div>
              <div className="w-3 h-3 rounded-sm bg-primary-700/50"></div>
              <div className="w-3 h-3 rounded-sm bg-primary-500/70"></div>
              <div className="w-3 h-3 rounded-sm bg-primary-500"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};
