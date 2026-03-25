import React from 'react';
import { DollarSign, Wallet, TrendingUp } from 'lucide-react';

interface FinancialSummaryProps {
  totalIncome: number;
  totalAdvances: number;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ totalIncome, totalAdvances }) => {
  const pendingBalance = totalIncome - totalAdvances;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-4 max-w-7xl mx-auto">
      {/* Total Income Card */}
      <div className="glass rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border-t-4 border-t-emerald-500">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-emerald-700 font-semibold mb-1">Ingresos Totales</p>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
              {formatCurrency(totalIncome)}
            </h3>
          </div>
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <TrendingUp strokeWidth={2.5} size={28} />
          </div>
        </div>
      </div>

      {/* Advances Card */}
      <div className="glass rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border-t-4 border-t-blue-500">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-blue-700 font-semibold mb-1">Anticipos Recibidos</p>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
              {formatCurrency(totalAdvances)}
            </h3>
          </div>
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Wallet strokeWidth={2.5} size={28} />
          </div>
        </div>
      </div>

      {/* Pending Balance Card */}
      <div className="glass rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border-t-4 border-t-orange-500">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-orange-700 font-semibold mb-1">Saldo Pendiente</p>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
              {formatCurrency(pendingBalance)}
            </h3>
          </div>
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <DollarSign strokeWidth={2.5} size={28} />
          </div>
        </div>
      </div>
    </div>
  );
};
