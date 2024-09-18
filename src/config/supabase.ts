// import { createClient } from "@supabase/supabase-js"
// import dotenv from 'dotenv'

// dotenv.config()


// const supabaseUrl = process.env.SUPABASE_URL as string
// const supabaseKey = process.env.SUPABASE_KEY as string


// export const supabase = createClient(supabaseUrl, supabaseKey)

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection
// supabase.from('tasks').select('*').limit(1)
//   .then(({ data, error }) => {
//     if (error) {
//       console.error('Error connecting to Supabase:', error.message)
//       console.error('Error details:', error)
//     } else {
//       console.log('Successfully connected to Supabase')
//       console.log('Data:', data)
//     }
//   }).catch((err) => {
//     console.error('Unexpected error:', err)
//   })
const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('tasks').select('*').limit(1);
      if (error) {
        console.error('Error connecting to Supabase:', error.message);
        console.error('Error details:', error);
      } else {
        console.log('Successfully connected to Supabase');
        console.log('Data:', data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };
  
  testConnection()