import { create } from 'zustand';
import type { TCTEvent } from '../types';
import { supabase } from '../lib/supabase';

interface EventState {
  events: TCTEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<TCTEvent, 'id' | 'createdAt'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<TCTEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventsByDateRange: (start: Date, end: Date) => TCTEvent[];
  getEventsByMonth: (year: number, month: number) => TCTEvent[];
  uploadEventImage: (file: File) => Promise<string | null>;
}

export const useEventStore = create<EventState>()((set, get) => ({
  events: [],
  isLoading: false,
  error: null,
  
  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('agenda_events')
        .select('*')
        .order('startDate', { ascending: true });
        
      if (error) throw error;
      set({ events: data as TCTEvent[], isLoading: false });
    } catch (err: any) {
      console.error('Error fetching events:', err);
      set({ error: err.message, isLoading: false });
    }
  },

  addEvent: async (eventData) => {
    try {
      const { data, error } = await supabase
        .from('agenda_events')
        .insert([eventData])
        .select()
        .single();
        
      if (error) throw error;
      set((state) => ({ events: [...state.events, data as TCTEvent] }));
    } catch (err: any) {
      console.error('Error adding event:', err);
      alert('Error al guardar en Supabase. Revisa la consola.');
    }
  },

  updateEvent: async (id, eventUpdate) => {
    try {
      const { data, error } = await supabase
        .from('agenda_events')
        .update(eventUpdate)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      set((state) => ({
        events: state.events.map((event) =>
          event.id === id ? { ...event, ...data } : event
        ),
      }));
    } catch (err: any) {
      console.error('Error updating event:', err);
      alert('Error al actualizar en Supabase.');
    }
  },

  deleteEvent: async (id) => {
    try {
      const { error } = await supabase
        .from('agenda_events')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
      }));
    } catch (err: any) {
      console.error('Error deleting event:', err);
      alert('Error al eliminar en Supabase.');
    }
  },

  getEventsByDateRange: (start, end) => {
    const { events } = get();
    return events.filter((e) => {
      if (!e.startDate) return false;
      const startDateString = e.startDate.includes('T') ? e.startDate.split('T')[0] : e.startDate;
      const eventDate = new Date(`${startDateString}T00:00:00`);
      return eventDate >= start && eventDate <= end;
    });
  },
  
  getEventsByMonth: (year, month) => {
    const { events } = get();
    return events.filter((e) => {
      if (!e.startDate) return false;
      const startDateString = e.startDate.includes('T') ? e.startDate.split('T')[0] : e.startDate;
      const eventDate = new Date(`${startDateString}T00:00:00`);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  },

  uploadEventImage: async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen a Supabase.');
      return null;
    }
  },
}));
