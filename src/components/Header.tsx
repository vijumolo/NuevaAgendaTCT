import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentDate, onPrevMonth, onNextMonth }) => {
  return (
    <header className="glass-dark text-white rounded-b-3xl shadow-2xl mb-8 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/3 -translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo & Title Section */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white/10 rounded-2xl p-2 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center shrink-0">
            <img 
              src="/Logo/LOGO TCT TRASPARENTE.png" 
              alt="TCT Colombia" 
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              AGENDA DE CRONOMETRAJES
            </h1>
            <p className="text-blue-200 mt-1 font-medium tracking-wide">
              TCT COLOMBIA | Gestión Profesional
            </p>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-4 bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-sm shadow-inner">
          <button 
            onClick={onPrevMonth}
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="w-48 text-center">
            <h2 className="text-2xl font-bold capitalize tracking-wide">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
          </div>

          <button 
            onClick={onNextMonth}
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
