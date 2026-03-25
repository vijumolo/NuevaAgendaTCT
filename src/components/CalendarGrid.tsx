import React from 'react';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, format, isSameMonth, isToday, addDays
} from 'date-fns';
// import { es } from 'date-fns/locale';
import type { TCTEvent } from '../types';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

interface CalendarGridProps {
  currentDate: Date;
  events: TCTEvent[];
  onAddEvent: (date: Date) => void;
  onEditEvent: (event: TCTEvent) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  currentDate, events, onAddEvent, onEditEvent 
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Utility to determine badge colors based on Event Type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'MTB': return 'bg-emerald-500 text-white shadow-emerald-500/40';
      case 'Ruta': return 'bg-blue-500 text-white shadow-blue-500/40';
      case 'Atletismo':
      case 'Running': return 'bg-rose-500 text-white shadow-rose-500/40';
      case 'Trail': return 'bg-amber-600 text-white shadow-amber-600/40';
      case 'Duatlón': return 'bg-purple-500 text-white shadow-purple-500/40';
      case 'Triatlón': return 'bg-indigo-500 text-white shadow-indigo-500/40';
      case 'Otros': return 'bg-slate-600 text-white shadow-slate-600/40';
      default: return 'bg-slate-500 text-white shadow-slate-500/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mb-24 cursor-default">
      <div className="glass rounded-3xl overflow-hidden shadow-2xl border border-white/40">
        {/* Header Days */}
        <div className="grid grid-cols-7 bg-slate-100/50 border-b border-slate-200">
          {weekDays.map(day => (
            <div key={day} className="py-4 text-center font-bold text-slate-600 tracking-wider text-sm uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 bg-white/40">
          {days.map((day) => {
            const dayEvents = events.filter(e => {
              if (!e.startDate) return false;
              const startDateString = e.startDate.includes('T') ? e.startDate.split('T')[0] : e.startDate;
              const eStartDate = new Date(`${startDateString}T00:00:00`);
              const eEndDate = addDays(eStartDate, Math.max(0, (e.durationDays || 1) - 1));
              return day >= eStartDate && day <= eEndDate; 
            });

            return (
              <div 
                key={day.toString()} 
                className={clsx(
                  "min-h-[140px] p-2 border-b border-r border-slate-100 relative group transition-colors duration-200",
                  !isSameMonth(day, monthStart) ? "bg-slate-50/50 text-slate-400" : "text-slate-700 bg-white/30 hover:bg-slate-50/80",
                  isToday(day) && "bg-blue-50/40 ring-inset ring-2 ring-blue-400 ring-opacity-50"
                )}
              >
                {/* Date Number Indicator */}
                <div className="flex justify-between items-start">
                  <span className={clsx(
                    "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold mb-2",
                    isToday(day) ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : ""
                  )}>
                    {format(day, dateFormat)}
                  </span>
                  
                  {/* Floating Add Action on Hover */}
                  <button 
                    onClick={() => onAddEvent(day)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Nuevo evento este día"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Event Markers */}
                <div className="absolute top-10 w-full left-0 px-2 flex flex-col gap-1 max-h-[90px] overflow-y-auto custom-scrollbar pr-1">
                  {dayEvents.map(evt => {
                    const isPast = new Date(`${evt.startDate.includes('T') ? evt.startDate.split('T')[0] : evt.startDate}T00:00:00`) < new Date(new Date().setHours(0,0,0,0));
                    return (
                    <div 
                      key={evt.id}
                      onClick={() => onEditEvent(evt)}
                      className={clsx(
                        "text-xs py-1 px-1.5 rounded-lg cursor-pointer shadow-sm hover:-translate-y-0.5 transition-transform flex items-center gap-2",
                        getBadgeColor(evt.eventType),
                        isPast && "opacity-60 saturate-50 line-through decoration-white/50"
                      )}
                      title={`${evt.name} - ${evt.responsible}${isPast ? ' (Finalizado)' : ''}`}
                    >
                      {evt.imageUrl && (
                        <img 
                          src={evt.imageUrl} 
                          alt="" 
                          className="w-5 h-5 rounded object-cover shrink-0 ring-1 ring-white/30" 
                        />
                      )}
                      <span className="truncate font-semibold">{evt.name}</span>
                    </div>
                  )})}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
