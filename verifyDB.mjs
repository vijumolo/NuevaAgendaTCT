import { createClient } from '@supabase/supabase-js';

const url = 'https://rpbrgawiqidtgrrqpiuj.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYnJnYXdpcWlkdGdycnFwaXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODEzNjYsImV4cCI6MjA4OTE1NzM2Nn0.7E_ZDBMGjqiByI7NiyRyCFKi8RW1GusuakACBJ-8d-k';

const supabase = createClient(url, key);

async function testQuery() {
  const { data, error } = await supabase.from('agenda_events').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Row:', data[0]);
  }
}
testQuery();
