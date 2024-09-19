import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import taskRoutes from './routes/taskRoutes'
import { supabase } from './config/supabase'

dotenv.config()


const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  // @ts-ignore
  origin: function (origin, callback) {
    const allowedOrigins = [process.env.CORS_ORIGIN, 'https://todoo-frontend-rjd2.vercel.app'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
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