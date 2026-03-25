-- 1. Añadir columna imageUrl a la tabla agenda_events
ALTER TABLE public.agenda_events
ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

-- 2. Insertar un nuevo bucket para almacenar las imágenes (si no existe)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Crear políticas de seguridad para el bucket 'event-images'
-- Permitir que cualquier persona pueda LEER las imágenes
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'event-images' );

-- Permitir a usuarios anónimos SUBIR imágenes (Dado que la app no forzará login por ahora)
CREATE POLICY "Public Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'event-images' );

-- Permitir actualizaciones públicas
CREATE POLICY "Public Updates" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'event-images' );

-- Permitir borrados públicos
CREATE POLICY "Public Deletes" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'event-images' );
