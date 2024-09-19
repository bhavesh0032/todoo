import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import taskRoutes from './routes/taskRoutes'
import { supabase } from './config/supabase'

dotenv.config()


const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000', 
  optionsSuccessStatus: 200
};


app.use(cors(corsOptions));
app.use(express.json());

// Test Supabase connection
// @ts-ignore
app.get('/test-db', async (req, res) => {
    try {
      const { data, error } = await supabase.from('tasks').select('*').limit(1);
      if (error) throw error;
      res.json({ message: 'Database connected successfully', data });
    } catch (error) {
      res.status(500).json({ message: 'Error connecting to database', error });
    }
  });

app.use('/api/tasks', taskRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment variables:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Not set');
  console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'Set' : 'Not set');
  });