
import { createClient, SupabaseClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize the Supabase client
export const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Set up Supabase realtime subscriptions
export const setupRealtimeSubscriptions = () => {
  // Enable all channel types
  supabase.channel('public:*')
    .on('postgres_changes', { event: '*', schema: 'public' }, payload => {
      console.log('Change received!', payload);
    })
    .subscribe();
};

// Function to handle session refresh
export const setupSessionRefresh = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed!');
    }
  });
};

// Call this function on app initialization to set up all the event listeners
export const initializeSupabase = () => {
  setupRealtimeSubscriptions();
  setupSessionRefresh();
};
