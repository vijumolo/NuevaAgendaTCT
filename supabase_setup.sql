-- Script para crear la tabla de eventos en Supabase
-- Cópialo y pégalo en el SQL Editor de tu proyecto en Supabase y dale a "Run"

CREATE TABLE IF NOT EXISTS agenda_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  responsible TEXT,
  phone TEXT,
  "startDate" DATE NOT NULL,
  "durationDays" INTEGER DEFAULT 1,
  "eventType" TEXT,
  "chipType" TEXT,
  "totalCost" NUMERIC DEFAULT 0,
  "advancePayment" NUMERIC DEFAULT 0,
  location TEXT,
  observations TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurar permisos para acceso público anónimo (para lectura y escritura sin login inicial)
ALTER TABLE agenda_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura a usuarios anonimos" 
ON agenda_events FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Permitir insercion a usuarios anonimos" 
ON agenda_events FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Permitir actualizacion a usuarios anonimos" 
ON agenda_events FOR UPDATE 
TO anon 
USING (true);

CREATE POLICY "Permitir borrado a usuarios anonimos" 
ON agenda_events FOR DELETE 
TO anon 
USING (true);
