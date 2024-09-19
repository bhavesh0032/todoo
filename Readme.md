# Todo App Backend

This is the backend for a Todo List application built with Node.js, Express, and Supabase.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3004
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```
4. Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project details.

## Running the Server

To start the server in development mode:

```
npm run dev
```

The server will start on `http://localhost:3004`.

## API Endpoints

- GET `/api/tasks`: Fetch all tasks
- POST `/api/tasks`: Create a new task
- PUT `/api/tasks/:id`: Update a task
- DELETE `/api/tasks/:id`: Delete a task

## Deployment

This backend is deployed on Render. To deploy your own instance:

1. Push your code to a GitHub repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set the environment variables in the Render dashboard
5. Deploy the service