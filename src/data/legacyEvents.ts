import type { TCTEvent } from "../types";

export const legacyEvents: Omit<TCTEvent, 'id' | 'createdAt'>[] = [
  {
    name: "4a Clásica Nacional Siachoque",
    responsible: "Pedro Sanabria Castellanos",
    phone: "3138824245",
    startDate: "2025-11-01",
    durationDays: 3,
    eventType: "Ruta",
    chipType: "Retornable",
    totalCost: 6000000,
    advancePayment: 6000000,
    location: "Siachoque",
    observations: "130 participantes"
  },
  {
    name: "Gran Fondo Ciudad de Tunja (GFCT)",
    responsible: "Giovanni Cañon y Yuverth",
    phone: "3143312731",
    startDate: "2025-12-14",
    durationDays: 1,
    eventType: "Ruta",
    chipType: "Retornable",
    totalCost: 9400000,
    advancePayment: 0,
    location: "Tunja",
    observations: ""
  },
  {
    name: "Guajira Bike challenge",
    responsible: "Miguel Ocampo",
    phone: "",
    startDate: "2026-01-21",
    durationDays: 8,
    eventType: "MTB",
    chipType: "Retornable",
    totalCost: 5500000,
    advancePayment: 0,
    location: "Guajira",
    observations: ""
  },
  {
    name: "MTB Gachancipa",
    responsible: "William Cardenas",
    phone: "",
    startDate: "2026-02-22",
    durationDays: 1,
    eventType: "MTB",
    chipType: "Retornable",
    totalCost: 7200000,
    advancePayment: 0,
    location: "",
    observations: "600 participantes"
  },
  {
    name: "Reto del Crucero",
    responsible: "Felipe Romero",
    phone: "",
    startDate: "2026-03-22",
    durationDays: 1,
    eventType: "MTB",
    chipType: "Retornable",
    totalCost: 4250000,
    advancePayment: 0,
    location: "Aguazul",
    observations: ""
  },
  {
    name: "Eventos Curiti",
    responsible: "Pendiente",
    phone: "",
    startDate: "2026-03-22",
    durationDays: 1,
    eventType: "MTB",
    chipType: "Retornable",
    totalCost: 0,
    advancePayment: 0,
    location: "Curiti",
    observations: "Extraído manualmente para corregir error del scraper"
  },
  {
    name: "Andes Epic",
    responsible: "Armando Castañeda",
    phone: "",
    startDate: "2026-06-05",
    durationDays: 3,
    eventType: "MTB",
    chipType: "Retornable",
    totalCost: 10000000,
    advancePayment: 0,
    location: "Barbosa",
    observations: ""
  },
  {
    name: "PICACHO CHALLENGE",
    responsible: "Manuel Carrascal",
    phone: "",
    startDate: "2026-09-05",
    durationDays: 1,
    eventType: "MTB",
    chipType: "Retornable",
    totalCost: 10000000,
    advancePayment: 0,
    location: "Bucaramanga",
    observations: ""
  }
];
