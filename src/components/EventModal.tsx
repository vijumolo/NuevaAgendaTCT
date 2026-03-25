import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, MapPin, DollarSign, Wallet, FileText, User, Tag, Ticket, Phone, ImagePlus, Loader2 } from 'lucide-react';
import type { TCTEvent, EventType, ChipType } from '../types';
import { format } from 'date-fns';
import { useEventStore } from '../store/useEventStore';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<TCTEvent, 'id' | 'createdAt'>) => void;
  onDelete?: (id: string) => void;
  initialDate?: Date;
  eventToEdit?: TCTEvent | null;
}

const EVENT_TYPES: EventType[] = ['MTB', 'Ruta', 'Running', 'Trail', 'Duatlón', 'Triatlón', 'Otros'];
const CHIP_TYPES: ChipType[] = ['Retornable', 'Desechable', 'Sin Chip'];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen, onClose, onSave, onDelete, initialDate, eventToEdit
}) => {
  const [formData, setFormData] = useState<Partial<TCTEvent>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadEventImage } = useEventStore();
  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        setFormData(eventToEdit);
      } else {
        setFormData({
          name: '',
          responsible: '',
          phone: '',
          startDate: initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          durationDays: 1,
          eventType: 'MTB',
          chipType: 'Retornable',
          totalCost: 0,
          advancePayment: 0,
          location: '',
          observations: ''
        });
      }
      setImageFile(null);
    }
  }, [isOpen, eventToEdit, initialDate]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationDays' || name === 'totalCost' || name === 'advancePayment'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    let finalImageUrl = formData.imageUrl;
    
    // Si hay un archivo nuevo, lo subimos
    if (imageFile) {
      const uploadedUrl = await uploadEventImage(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }

    onSave({
      ...(formData as Omit<TCTEvent, 'id' | 'createdAt'>),
      imageUrl: finalImageUrl
    });
    
    setIsUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            {eventToEdit ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                  <Tag size={16} className="text-blue-500" /> Nombre del Evento
                </label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white/70 backdrop-blur-sm"
                  placeholder="Ej: Reto del Crucero"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                  <User size={16} className="text-blue-500" /> Responsable
                </label>
                <input 
                  required
                  type="text" 
                  name="responsible"
                  value={formData.responsible || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white/70"
                  placeholder="Nombre de contacto"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                  <Phone size={16} className="text-blue-500" /> Móvil Pcto
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white/70"
                  placeholder="Ej: 300 123 4567"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                  <Ticket size={16} className="text-blue-500" /> Tipo de Evento & Chip
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    name="eventType"
                    value={formData.eventType || 'MTB'}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white/70"
                  >
                    {EVENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  <select 
                    name="chipType"
                    value={formData.chipType || 'Retornable'}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white/70"
                  >
                    {CHIP_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                  <CalendarIcon size={16} className="text-indigo-500" /> Fecha y Duración (Días)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    required
                    type="date" 
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleChange}
                    className="col-span-2 px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white/70"
                  />
                  <input 
                    required
                    type="number" 
                    min="1"
                    name="durationDays"
                    value={formData.durationDays || 1}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white/70"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                  <DollarSign size={16} className="text-emerald-500" /> Costo Total (COP)
                </label>
                <input 
                  required
                  type="number" 
                  name="totalCost"
                  value={formData.totalCost || 0}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 transition-shadow bg-white/70"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                  <Wallet size={16} className="text-emerald-500" /> Anticipo / Abono (COP)
                </label>
                <input 
                  required
                  type="number" 
                  name="advancePayment"
                  value={formData.advancePayment || 0}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 transition-shadow bg-white/70"
                />
              </div>
            </div>
          </div>
          
          {/* Form Bottom Row */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
              <MapPin size={16} className="text-purple-500" /> Ubicación
            </label>
            <input 
              required
              type="text" 
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 transition-shadow bg-white/70"
              placeholder="Ej: Curití, Santander"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
              <FileText size={16} className="text-purple-500" /> Observaciones
            </label>
            <textarea 
              name="observations"
              value={formData.observations || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 transition-shadow bg-white/70 resize-none"
              placeholder="Notas adicionales..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
              <ImagePlus size={16} className="text-pink-500" /> Banner / Imagen del Evento
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-white/50 hover:bg-slate-50 transition-colors relative">
              <div className="space-y-1 text-center">
                {(imageFile || formData.imageUrl) ? (
                  <div className="relative inline-block group">
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl} 
                      alt="Preview" 
                      className="mx-auto h-32 w-auto object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setFormData(prev => ({ ...prev, imageUrl: '' }));
                      }}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImagePlus className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Sube una imagen</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }} />
                      </label>
                      <p className="pl-1 text-slate-500">o toca aquí</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">PNG, JPG, GIF hasta 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {eventToEdit && onDelete ? (
              <button 
                type="button" 
                onClick={() => onDelete(eventToEdit.id)}
                className="px-6 py-2.5 rounded-xl font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                Eliminar
              </button>
            ) : <div />}
            
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={isUploading}
                className="px-8 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2"
              >
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : 'Guardar'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
