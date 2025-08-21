import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface TimeSlot {
  day: string;
  time: string;
  dayName: string;
}

interface CalendarProps {
  selectedSlots: TimeSlot[];
  onSlotsChange: (slots: TimeSlot[]) => void;
}

export function Calendar({ selectedSlots, onSlotsChange }: CalendarProps) {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: availability = [] } = useQuery({
    queryKey: ["/api/availability"],
  });

  // Generate time slots based on availability
  const generateTimeSlots = () => {
    const slots: { [key: string]: { dayName: string; times: string[] } } = {};
    
    // Use only dates that have been explicitly added by admin
    (availability as any[]).forEach((av: any) => {
      if (av.enabled && av.date) {
        const date = new Date(av.date + 'T00:00:00'); // Ensure proper date parsing
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Only show dates from today onwards
        if (date >= today) {
          const dayNames = [
            t("days.sunday"), t("days.monday"), t("days.tuesday"), 
            t("days.wednesday"), t("days.thursday"), t("days.friday"), t("days.saturday")
          ];
          
          const dayOfWeek = date.getDay();
          slots[av.date] = {
            dayName: `${dayNames[dayOfWeek]} ${date.getDate()} ${date.toLocaleDateString('nl-NL', { month: 'short' })}`,
            times: generateTimeSlotsForDay(av.startTime, av.endTime)
          };
        }
      }
    });
    
    return slots;
  };

  const generateTimeSlotsForDay = (startTime: string, endTime: string) => {
    const slots = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const nextMinute = currentMinute + 30;
      const nextHour = currentHour + Math.floor(nextMinute / 60);
      const adjustedNextMinute = nextMinute % 60;
      
      if (nextHour < endHour || (nextHour === endHour && adjustedNextMinute <= endMinute)) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}-${nextHour.toString().padStart(2, '0')}:${adjustedNextMinute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
      
      currentMinute = adjustedNextMinute;
      currentHour = nextHour;
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const toggleSlot = (day: string, time: string, dayName: string) => {
    const slot: TimeSlot = { day, time, dayName };
    const isSelected = selectedSlots.some(s => s.day === day && s.time === time);
    
    if (isSelected) {
      onSlotsChange(selectedSlots.filter(s => !(s.day === day && s.time === time)));
    } else {
      onSlotsChange([...selectedSlots, slot]);
    }
  };

  const isSlotSelected = (day: string, time: string) => {
    return selectedSlots.some(s => s.day === day && s.time === time);
  };

  return (
    <div className="relative">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 glassmorphism rounded-3xl shadow-2xl"></div>
      
      {/* Calendar Content */}
      <div className="relative z-10 p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">
            {t("booking.calendar.title")}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {t("booking.calendar.subtitle")}
          </p>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setCurrentDate(newDate);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setCurrentDate(newDate);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Available Days */}
        <div className="space-y-6">
          {Object.entries(timeSlots).map(([day, { dayName, times }]) => (
            <div key={day} className="border-b border-gray-200/30 dark:border-gray-700/30 pb-6 last:border-b-0">
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CalendarDays className="h-5 w-5 text-navy-600 mr-2" />
                {dayName}
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {times.map((time) => (
                  <Button
                    key={time}
                    variant={isSlotSelected(day, time) ? "default" : "outline"}
                    size="sm"
                    className={`p-3 text-sm transition-all duration-200 ${
                      isSlotSelected(day, time)
                        ? "bg-navy-500 text-white border-navy-500 hover:bg-navy-600"
                        : "glassmorphism-card hover:border-navy-400 hover:bg-navy-50/50 dark:hover:bg-navy-900/20"
                    }`}
                    onClick={() => toggleSlot(day, time, dayName)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
          <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Legenda:
          </h6>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 glassmorphism-card border border-gray-200/30 dark:border-gray-600/30 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {t("booking.calendar.legend.available")}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-navy-500 border border-navy-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {t("booking.calendar.legend.selected")}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {t("booking.calendar.legend.booked")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
