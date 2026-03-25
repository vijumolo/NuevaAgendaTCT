import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FinancialSummary } from './components/FinancialSummary';
import { CalendarGrid } from './components/CalendarGrid';
import { EventModal } from './components/EventModal';
import { useEventStore } from './store/useEventStore';
import { addMonths, subMonths, addDays, format } from 'date-fns';
import type { TCTEvent } from './types';
import { Plus, Download } from 'lucide-react';
import { legacyEvents } from './data/legacyEvents';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [eventToEdit, setEventToEdit] = useState<TCTEvent | null>(null);

  const { events, addEvent, updateEvent, deleteEvent, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleAddEventClick = (date?: Date) => {
    setSelectedDate(date || currentDate);
    setEventToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditEventClick = (event: TCTEvent) => {
    setEventToEdit(event);
    setSelectedDate(undefined);
    setIsModalOpen(true);
  };

  const currentMonthEvents = events.filter(e => {
    if (!e.startDate) return false;
    const startDateString = e.startDate.includes('T') ? e.startDate.split('T')[0] : e.startDate;
    const eDate = new Date(`${startDateString}T00:00:00`);
    return eDate.getFullYear() === currentDate.getFullYear() && eDate.getMonth() === currentDate.getMonth();
  });

  const totalIncome = currentMonthEvents.reduce((sum, e) => sum + e.totalCost, 0);
  const totalAdvances = currentMonthEvents.reduce((sum, e) => sum + e.advancePayment, 0);

  const handleSaveEvent = (eventData: Omit<TCTEvent, 'id' | 'createdAt'>) => {
    const startStr = eventData.startDate.includes('T') ? eventData.startDate.split('T')[0] : eventData.startDate;
    const startDateObj = new Date(`${startStr}T00:00:00`);
    const duration = eventData.durationDays || 1;

    for (let i = 0; i < duration; i++) {
        const d = addDays(startDateObj, i);
        let count = 0;
        for (const ev of events) {
            if (eventToEdit && ev.id === eventToEdit.id) continue;
            if (!ev.startDate) continue;
            
            const evStartStr = ev.startDate.includes('T') ? ev.startDate.split('T')[0] : ev.startDate;
            const evStartDate = new Date(`${evStartStr}T00:00:00`);
            const evEndDate = addDays(evStartDate, Math.max(0, (ev.durationDays || 1) - 1));
            
            if (d >= evStartDate && d <= evEndDate) {
                count++;
            }
        }
        if (count >= 3) {
            alert(`No se puede guardar: El día ${format(d, 'dd/MM/yyyy')} ya tiene el máximo de 3 eventos permitidos.`);
            return;
        }
    }

    if (eventToEdit) {
      updateEvent(eventToEdit.id, eventData);
    } else {
      addEvent(eventData);
    }
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    setIsModalOpen(false);
  };

  const handleMigrateData = async () => {
    // Para asegurar que corra sin bloqueos de popups del navegador
    console.log("Iniciando migración de datos hacia Supabase...");
    for (const event of legacyEvents) {
      await addEvent(event as Omit<TCTEvent, 'id' | 'createdAt'>);
    }
    alert('¡Eventos migrados exitosamente a Supabase! Los datos ya están en la nube.');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative pb-10">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-200 -z-10"></div>

      <Header 
        currentDate={currentDate} 
        onPrevMonth={handlePrevMonth} 
        onNextMonth={handleNextMonth} 
      />

      {/* Temporary Migration Button */}
      {events.length === 0 && (
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={handleMigrateData}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
          >
            <Download size={16} /> Importar Datos Anteriores
          </button>
        </div>
      )}
      
      <main className="relative z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <FinancialSummary totalIncome={totalIncome} totalAdvances={totalAdvances} />
        
        <CalendarGrid 
          currentDate={currentDate} 
          events={events} 
          onAddEvent={handleAddEventClick}
          onEditEvent={handleEditEventClick}
        />
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => handleAddEventClick()}
        className="fixed bottom-8 right-8 w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(220,38,38,0.4)] hover:shadow-[0_8px_30px_rgb(220,38,38,0.6)] hover:bg-red-500 hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-300 z-40 group"
      >
        <Plus size={32} />
        <span className="absolute right-full mr-4 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
          Crear Evento
        </span>
      </button>

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialDate={selectedDate}
        eventToEdit={eventToEdit}
      />
    </div>
  );
}

export default App;
