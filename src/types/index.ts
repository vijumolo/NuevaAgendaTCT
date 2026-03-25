export type EventType = 'MTB' | 'Ruta' | 'Atletismo' | 'Trail' | 'Duatlón' | 'Triatlón' | 'Otros';
export type ChipType = 'Retornable' | 'Desechable' | 'Sin Chip';

export interface TCTEvent {
  id: string;
  name: string;
  responsible: string;
  phone: string;
  startDate: string; // ISO string YYYY-MM-DD
  durationDays: number;
  eventType: EventType;
  chipType: ChipType;
  totalCost: number;
  advancePayment: number;
  location: string;
  observations: string;
  imageUrl?: string;
  createdAt: string;
}
